import { prisma } from "@/lib/prisma"
import { Prisma, WebsiteReview } from "@/lib/generated/prisma/client"

export class ReviewRepository {
  async findMany(): Promise<WebsiteReview[]> {
    return prisma.websiteReview.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findById(id: string): Promise<WebsiteReview | null> {
    return prisma.websiteReview.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.WebsiteReviewCreateInput): Promise<WebsiteReview> {
    return prisma.websiteReview.create({
      data,
    })
  }

  async delete(id: string): Promise<WebsiteReview> {
    return prisma.websiteReview.delete({
      where: { id },
    })
  }
}

export const reviewRepository = new ReviewRepository()

