import { z } from "zod"
import { websiteReviewSchema } from "../schemas/review.schema"
import { WebsiteReview } from "@/lib/generated/prisma/client"

export type WebsiteReviewFormInput = z.input<typeof websiteReviewSchema>
export type WebsiteReviewFormOutput = z.output<typeof websiteReviewSchema>

export type { WebsiteReview }

