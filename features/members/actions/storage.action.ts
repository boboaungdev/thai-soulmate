"use server"

import { revalidatePath } from "next/cache"
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { prisma } from "@/lib/prisma"
import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"
import {
  getUniqueFolderName,
  getUniqueFileName,
} from "../repositories/storage-name.repository"

export async function getProfileStorageAction(profileId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { id: true },
    })

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    const [folders, files] = await Promise.all([
      prisma.profileFolder.findMany({
        where: { profileId },
        include: {
          _count: {
            select: { files: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.profileFile.findMany({
        where: { profileId },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const totalSize = files.reduce((acc, file) => acc + file.size, 0)

    return {
      success: true,
      folders: JSON.parse(JSON.stringify(folders)),
      files: JSON.parse(JSON.stringify(files)),
      totalFiles: files.length,
      totalSize,
    }
  } catch (error: any) {
    console.error("getProfileStorageAction error:", error)
    return {
      success: false,
      error: error?.message || "Failed to fetch storage.",
    }
  }
}

export async function createProfileFolderAction(
  profileId: string,
  name: string
) {
  try {
    const folderName = name?.trim()
    if (!folderName) {
      return { success: false, error: "Folder name is required." }
    }

    const existing = await prisma.profileFolder.findUnique({
      where: {
        profileId_name: {
          profileId,
          name: folderName,
        },
      },
    })

    if (existing) {
      return {
        success: false,
        error: "A folder with this name already exists.",
      }
    }

    const folder = await prisma.profileFolder.create({
      data: {
        name: folderName,
        profileId,
      },
      include: {
        _count: {
          select: { files: true },
        },
      },
    })

    revalidatePath(`/dashboard/profiles/${profileId}`)
    return { success: true, folder: JSON.parse(JSON.stringify(folder)) }
  } catch (error: any) {
    console.error("createProfileFolderAction error:", error)
    return {
      success: false,
      error: error?.message || "Failed to create folder.",
    }
  }
}

export async function renameProfileFolderAction(
  profileId: string,
  folderId: string,
  name: string
) {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: "Folder name is required." }
    }

    const folder = await prisma.profileFolder.findUnique({
      where: { id: folderId },
    })

    if (!folder || folder.profileId !== profileId) {
      return { success: false, error: "Folder not found." }
    }

    const uniqueFolderName = await getUniqueFolderName(
      profileId,
      name,
      folderId
    )

    const updatedFolder = await prisma.profileFolder.update({
      where: { id: folderId },
      data: { name: uniqueFolderName },
      include: {
        _count: {
          select: { files: true },
        },
      },
    })

    revalidatePath(`/dashboard/profiles/${profileId}`)
    return { success: true, folder: JSON.parse(JSON.stringify(updatedFolder)) }
  } catch (error: any) {
    console.error("renameProfileFolderAction error:", error)
    return {
      success: false,
      error: error?.message || "Failed to rename folder.",
    }
  }
}

export async function deleteProfileFolderAction(
  profileId: string,
  folderId: string,
  deleteFiles: boolean = false
) {
  try {
    const folder = await prisma.profileFolder.findUnique({
      where: { id: folderId },
      include: { files: true },
    })

    if (!folder || folder.profileId !== profileId) {
      return { success: false, error: "Folder not found." }
    }

    if (deleteFiles && folder.files.length > 0) {
      for (const file of folder.files) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: env.R2.BUCKET,
              Key: file.r2Key,
            })
          )
        } catch (r2Error) {
          console.error(`Storage delete error for file ${file.name}:`, r2Error)
        }
      }
      await prisma.profileFile.deleteMany({ where: { folderId } })
    } else {
      await prisma.profileFile.updateMany({
        where: { folderId },
        data: { folderId: null },
      })
    }

    await prisma.profileFolder.delete({ where: { id: folderId } })

    revalidatePath(`/dashboard/profiles/${profileId}`)
    return {
      success: true,
      message: deleteFiles
        ? "Folder and all its files deleted."
        : "Folder deleted and files moved to All Files.",
    }
  } catch (error: any) {
    console.error("deleteProfileFolderAction error:", error)
    return {
      success: false,
      error: error?.message || "Failed to delete folder.",
    }
  }
}

export async function uploadProfileFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null
    const profileId = formData.get("profileId") as string
    const folderId = (formData.get("folderId") as string | null) || null
    const uploadedBy = (formData.get("uploadedBy") as string | null) || "Staff"

    if (!file || !profileId) {
      return { success: false, error: "Missing required upload data." }
    }

    let folderPath = "root"
    if (folderId) {
      const folder = await prisma.profileFolder.findUnique({
        where: { id: folderId },
        select: { name: true },
      })
      if (folder) {
        folderPath = folder.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
      }
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const r2Key = `profiles/${profileId}/${folderPath}/${Date.now()}-${sanitizedFileName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2.BUCKET,
        Key: r2Key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    )

    const fileUrl = `${env.R2.PUBLIC_URL}/${r2Key}`

    const fileRecord = await prisma.profileFile.create({
      data: {
        name: file.name,
        url: fileUrl,
        r2Key,
        size: buffer.length,
        mimeType: file.type || "application/octet-stream",
        folderId: folderId || null,
        profileId,
        uploadedBy,
      },
    })

    revalidatePath(`/dashboard/profiles/${profileId}`)
    return { success: true, file: JSON.parse(JSON.stringify(fileRecord)) }
  } catch (error: any) {
    console.error("uploadProfileFileAction error:", error)
    return { success: false, error: error?.message || "Failed to upload file." }
  }
}

export async function renameProfileFileAction(
  profileId: string,
  fileId: string,
  name: string
) {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: "File name is required." }
    }

    const file = await prisma.profileFile.findUnique({ where: { id: fileId } })
    if (!file || file.profileId !== profileId) {
      return { success: false, error: "File not found." }
    }

    let targetName = name.trim()
    const dotIndex = file.name.lastIndexOf(".")
    const originalExt = dotIndex !== -1 ? file.name.slice(dotIndex) : ""
    if (
      originalExt &&
      !targetName.toLowerCase().endsWith(originalExt.toLowerCase())
    ) {
      targetName = `${targetName}${originalExt}`
    }

    const uniqueFileName = await getUniqueFileName(
      profileId,
      file.folderId,
      targetName,
      fileId
    )

    const updatedFile = await prisma.profileFile.update({
      where: { id: fileId },
      data: { name: uniqueFileName },
    })

    revalidatePath(`/dashboard/profiles/${profileId}`)
    return { success: true, file: JSON.parse(JSON.stringify(updatedFile)) }
  } catch (error: any) {
    console.error("renameProfileFileAction error:", error)
    return { success: false, error: error?.message || "Failed to rename file." }
  }
}

export async function deleteProfileFileAction(
  profileId: string,
  fileId: string
) {
  try {
    const file = await prisma.profileFile.findUnique({ where: { id: fileId } })
    if (!file || file.profileId !== profileId) {
      return { success: false, error: "File not found." }
    }

    try {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: env.R2.BUCKET,
          Key: file.r2Key,
        })
      )
    } catch (r2Error) {
      console.error("Storage delete warning:", r2Error)
    }

    await prisma.profileFile.delete({ where: { id: fileId } })

    revalidatePath(`/dashboard/profiles/${profileId}`)
    return { success: true }
  } catch (error: any) {
    console.error("deleteProfileFileAction error:", error)
    return { success: false, error: error?.message || "Failed to delete file." }
  }
}
