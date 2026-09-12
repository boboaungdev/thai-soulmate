import { reviewRepository } from "../repositories/review.repository"
import { WebsiteReviewFormOutput } from "../types/review.types"
import { resend } from "@/lib/resend"
import { WebsiteReviewAdminNotificationEmail } from "../emails"
import { APP_INFO, CONTACT, EMAIL } from "@/constants"

export class ReviewService {
  async getReviews() {
    return reviewRepository.findMany()
  }

  async getReviewById(id: string) {
    return reviewRepository.findById(id)
  }

  async submitReview(data: WebsiteReviewFormOutput) {
    const {
      firstImpression,
      easeOfUse,
      designBranding,
      understandingService,
      trustSafety,
      contentQuality,
      registrationProcess,
      pricingValue,
      overallExperience,
      matchmakingSpecific,
      reviewerInfo,
    } = data

    const review = await reviewRepository.create({
      firstImpression,
      easeOfUse,
      designBranding,
      understandingService,
      trustSafety,
      contentQuality,
      registrationProcess,
      pricingValue,
      overallExperience,
      matchmakingSpecific,
      reviewerInfo: reviewerInfo || undefined,
    })

    try {
      await resend.emails.send({
        from: `"${APP_INFO.name}" <${EMAIL.notify}>`,
        to: [CONTACT.email],
        subject: `[Website Review] New review submitted by - ${
          reviewerInfo?.name || "Anonymous"
        }`,
        react: WebsiteReviewAdminNotificationEmail({
          reviewerInfo: reviewerInfo || undefined,
        }),
      })
    } catch (adminError) {
      console.error(
        "Website review admin notification email failed:",
        adminError
      )
    }

    return review
  }

  async deleteReview(id: string) {
    return reviewRepository.delete(id)
  }
}

export const reviewService = new ReviewService()
