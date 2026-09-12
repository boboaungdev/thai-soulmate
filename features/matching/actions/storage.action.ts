"use server"

import { revalidatePath } from "next/cache"
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"
import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { TrackingRepository } from "../repositories/tracking.repository"

export async function getTrackingStorageAction(trackingId: string) {
  try {
    const storage = await TrackingRepository.findTrackingStorage(trackingId)
    return { success: true, ...storage }
  } catch (error) {
    console.error("getTrackingStorageAction error:", error)
    return {
      success: false,
      folders: [],
      files: [],
      totalFiles: 0,
      totalSize: 0,
      error: "Failed to fetch storage",
    }
  }
}

export async function createTrackingFolderAction(
  trackingId: string,
  name: string,
  createdById?: string | null
) {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: "Folder name is required" }
    }

    const folder = await TrackingRepository.createFolder({
      trackingId,
      name: name.trim(),
      createdById: createdById || null,
    })

    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return { success: true, folder }
  } catch (error) {
    console.error("createTrackingFolderAction error:", error)
    return { success: false, error: "Failed to create folder" }
  }
}

export async function renameTrackingFolderAction(
  trackingId: string,
  folderId: string,
  name: string
) {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: "Folder name is required" }
    }

    const folder = await TrackingRepository.updateFolder(folderId, {
      name: name.trim(),
    })

    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return { success: true, folder }
  } catch (error) {
    console.error("renameTrackingFolderAction error:", error)
    return { success: false, error: "Failed to rename folder" }
  }
}

export async function deleteTrackingFolderAction(
  trackingId: string,
  folderId: string,
  deleteFiles = false
) {
  try {
    const folder = await TrackingRepository.findFolderById(folderId)
    if (!folder || folder.trackingId !== trackingId) {
      return { success: false, error: "Folder not found" }
    }

    if (deleteFiles && folder.files && folder.files.length > 0) {
      for (const file of folder.files) {
        if (file.r2Key) {
          try {
            await r2.send(
              new DeleteObjectCommand({
                Bucket: env.R2.BUCKET,
                Key: file.r2Key,
              })
            )
          } catch (r2Err) {
            console.error("Failed to delete R2 object:", file.r2Key, r2Err)
          }
        }
      }
      await prisma.trackingFile.deleteMany({
        where: { folderId },
      })
    } else {
      await prisma.trackingFile.updateMany({
        where: { folderId },
        data: { folderId: null },
      })
    }

    await TrackingRepository.deleteFolder(folderId)
    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return { success: true }
  } catch (error) {
    console.error("deleteTrackingFolderAction error:", error)
    return { success: false, error: "Failed to delete folder" }
  }
}

export async function uploadTrackingFileAction(
  trackingId: string,
  formData: FormData
) {
  try {
    const file = formData.get("file") as File | null
    const folderId = (formData.get("folderId") as string | null) || null
    const uploadedBy = (formData.get("uploadedBy") as string | null) || null

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    let folderPath = "root"
    if (folderId) {
      const folder = await TrackingRepository.findFolderById(folderId)
      if (folder) {
        folderPath = folder.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
      }
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const r2Key = `tracking/${trackingId}/${folderPath}/${Date.now()}-${sanitizedFileName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2.BUCKET,
        Key: r2Key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    )

    const publicUrl = `${env.R2.PUBLIC_URL}/${r2Key}`

    const fileRecord = await TrackingRepository.createFile({
      trackingId,
      folderId,
      name: file.name,
      url: publicUrl,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      r2Key,
      uploadedBy,
    })

    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return { success: true, file: fileRecord }
  } catch (error) {
    console.error("uploadTrackingFileAction error:", error)
    return { success: false, error: "Failed to upload file" }
  }
}

export async function renameTrackingFileAction(
  trackingId: string,
  fileId: string,
  name: string
) {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: "File name is required" }
    }

    const file = await TrackingRepository.updateFile(fileId, {
      name: name.trim(),
    })

    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return { success: true, file }
  } catch (error) {
    console.error("renameTrackingFileAction error:", error)
    return { success: false, error: "Failed to rename file" }
  }
}

export async function deleteTrackingFileAction(
  trackingId: string,
  fileId: string
) {
  try {
    const file = await TrackingRepository.findFileById(fileId)
    if (!file || file.trackingId !== trackingId) {
      return { success: false, error: "File not found" }
    }

    if (file.r2Key) {
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: env.R2.BUCKET,
            Key: file.r2Key,
          })
        )
      } catch (r2Err) {
        console.error("Failed to delete R2 object:", file.r2Key, r2Err)
      }
    }

    await TrackingRepository.deleteFile(fileId)
    revalidatePath(`/dashboard/tracking/${trackingId}`)
    return { success: true }
  } catch (error) {
    console.error("deleteTrackingFileAction error:", error)
    return { success: false, error: "Failed to delete file" }
  }
}

