import { prisma } from "@/lib/prisma"
import { Prisma, TrackingStatus, TrackingNoteType } from "@/lib/generated/prisma/client"

export class TrackingRepository {
  static async findTrackings(params: {
    where: Prisma.TrackingWhereInput
    orderBy: Prisma.TrackingOrderByWithRelationInput
    skip?: number
    take?: number
  }) {
    return prisma.tracking.findMany({
      where: params.where,
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
      include: {
        male: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
            profile: true,
          },
        },
        female: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
            profile: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })
  }

  static async countTrackings(where?: Prisma.TrackingWhereInput) {
    return prisma.tracking.count({ where })
  }

  static async findAllMembersForTrackings() {
    return prisma.tracking.findMany({
      select: {
        male: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
          },
        },
        female: {
          select: {
            id: true,
            customId: true,
            personalDetails: true,
            photos: true,
          },
        },
      },
    })
  }

  static async findTrackingById(id: string) {
    return prisma.tracking.findUnique({
      where: { id },
      include: {
        male: {
          include: {
            profile: true,
          },
        },
        female: {
          include: {
            profile: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
        notes: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
  }

  static async findActiveTrackingBetween(maleId: string, femaleId: string) {
    return prisma.tracking.findFirst({
      where: {
        OR: [
          { maleId, femaleId },
          { maleId: femaleId, femaleId: maleId },
        ],
        status: {
          not: TrackingStatus.CLOSED,
        },
      },
    })
  }

  static async createTracking(data: {
    maleId: string
    femaleId: string
    matchPercentage: number
  }) {
    return prisma.tracking.create({
      data: {
        maleId: data.maleId,
        femaleId: data.femaleId,
        matchPercentage: data.matchPercentage,
        status: TrackingStatus.INITIAL_CONNECT,
        completedStatuses: [TrackingStatus.INITIAL_CONNECT],
        statusHistory: {
          create: {
            status: TrackingStatus.INITIAL_CONNECT,
            changedBy: "System",
            note: "Initial soulmate connection created",
          },
        },
      },
      include: {
        male: true,
        female: true,
      },
    })
  }

  static async updateTracking(
    id: string,
    data: Prisma.TrackingUpdateInput
  ) {
    return prisma.tracking.update({
      where: { id },
      data,
      include: {
        male: {
          include: { profile: true },
        },
        female: {
          include: { profile: true },
        },
        statusHistory: {
          orderBy: { createdAt: "asc" },
        },
      },
    })
  }

  static async deleteTracking(id: string) {
    return prisma.tracking.delete({
      where: { id },
    })
  }

  // --- Tracking Notes ---
  static async findTrackingNotes(trackingId: string) {
    return prisma.trackingNote.findMany({
      where: { trackingId },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  static async findTrackingNoteById(noteId: string) {
    return prisma.trackingNote.findUnique({
      where: { id: noteId },
    })
  }

  static async createTrackingNote(data: {
    trackingId: string
    userId: string
    message: string
    type?: TrackingNoteType
  }) {
    return prisma.trackingNote.create({
      data: {
        trackingId: data.trackingId,
        userId: data.userId,
        message: data.message,
        type: data.type || TrackingNoteType.MANUAL,
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
      },
    })
  }

  static async updateTrackingNote(
    noteId: string,
    data: { message?: string; type?: TrackingNoteType }
  ) {
    return prisma.trackingNote.update({
      where: { id: noteId },
      data,
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            email: true,
            role: true,
          },
        },
      },
    })
  }

  static async deleteTrackingNote(noteId: string) {
    return prisma.trackingNote.delete({
      where: { id: noteId },
    })
  }

  // --- Tracking Storage ---
  static async findTrackingStorage(trackingId: string) {
    const [folders, files] = await Promise.all([
      prisma.trackingFolder.findMany({
        where: { trackingId },
        include: {
          _count: {
            select: { files: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.trackingFile.findMany({
        where: { trackingId },
        orderBy: { createdAt: "desc" },
      }),
    ])

    const totalSize = files.reduce((acc, file) => acc + file.size, 0)

    return {
      folders,
      files,
      totalFiles: files.length,
      totalSize,
    }
  }

  static async findFolderById(id: string) {
    return prisma.trackingFolder.findUnique({
      where: { id },
      include: { files: true },
    })
  }

  static async createFolder(data: {
    trackingId: string
    name: string
    createdById?: string | null
  }) {
    return prisma.trackingFolder.create({
      data,
    })
  }

  static async updateFolder(id: string, data: { name: string }) {
    return prisma.trackingFolder.update({
      where: { id },
      data,
    })
  }

  static async deleteFolder(id: string) {
    return prisma.trackingFolder.delete({
      where: { id },
    })
  }

  static async findFileById(id: string) {
    return prisma.trackingFile.findUnique({
      where: { id },
    })
  }

  static async createFile(data: {
    trackingId: string
    folderId?: string | null
    name: string
    url: string
    size: number
    mimeType: string
    r2Key: string
    uploadedBy?: string | null
  }) {
    return prisma.trackingFile.create({
      data,
    })
  }

  static async updateFile(id: string, data: { name: string }) {
    return prisma.trackingFile.update({
      where: { id },
      data,
    })
  }

  static async deleteFile(id: string) {
    return prisma.trackingFile.delete({
      where: { id },
    })
  }
}

