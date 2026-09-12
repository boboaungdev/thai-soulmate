import { prisma } from "@/lib/prisma"
import { Role } from "@/lib/generated/prisma/enums"

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  })
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  })
}

export async function findUsers(limit: number = 100, page: number = 1) {
  const skip = (page - 1) * limit
  const where = {
    role: { not: Role.DEV },
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        registerInterest: {
          select: {
            id: true,
            gender: true,
            nationality: true,
            currentLocation: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  return { users, total, totalPages: Math.ceil(total / limit) }
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: Role
  avatar?: string | null
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: data.role,
      avatar: data.avatar || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      createdAt: true,
      registerInterest: {
        select: {
          id: true,
          gender: true,
          nationality: true,
          currentLocation: true,
        },
      },
    },
  })
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  })
}

