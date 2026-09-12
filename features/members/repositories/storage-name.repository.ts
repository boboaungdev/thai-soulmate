import { prisma } from "@/lib/prisma"

export async function getUniqueFolderName(
  profileId: string,
  requestedName: string,
  excludeFolderId?: string
): Promise<string> {
  const baseName = requestedName.trim()
  let name = baseName
  let counter = 1

  while (true) {
    const existing = await prisma.profileFolder.findFirst({
      where: {
        profileId,
        name: {
          equals: name,
          mode: "insensitive",
        },
        ...(excludeFolderId ? { id: { not: excludeFolderId } } : {}),
      },
    })

    if (!existing) {
      return name
    }

    name = `${baseName} (${counter})`
    counter++
  }
}

export async function getUniqueFileName(
  profileId: string,
  folderId: string | null,
  requestedName: string,
  excludeFileId?: string
): Promise<string> {
  const trimmed = requestedName.trim()
  const dotIndex = trimmed.lastIndexOf(".")
  const baseName = dotIndex !== -1 ? trimmed.slice(0, dotIndex) : trimmed
  const extension = dotIndex !== -1 ? trimmed.slice(dotIndex) : ""

  let name = trimmed
  let counter = 1

  while (true) {
    const existing = await prisma.profileFile.findFirst({
      where: {
        profileId,
        folderId,
        name: {
          equals: name,
          mode: "insensitive",
        },
        ...(excludeFileId ? { id: { not: excludeFileId } } : {}),
      },
    })

    if (!existing) {
      return name
    }

    name = `${baseName} (${counter})${extension}`
    counter++
  }
}
