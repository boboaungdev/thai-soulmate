import { APP_INFO, BASE_URL } from "@/constants"

type UserDetails = {
  name: string
  prefix: string
}

type AdminNotificationDetails = {
  prefix: string
  name: string
  birthday: string
  age: number
  gender: string
  nationality: string
  location: string
  email: string
  phone: string
}

const appNameGradientStyle =
  "background-image: linear-gradient(to right, #cfa14f, #cb5d7a); -webkit-background-clip: text; background-clip: text; color: transparent; font-weight: bold;"

export const getUserConfirmationHtml = ({
  name,
  prefix,
}: UserDetails): string => {
  const appNameWithStyle = `<span style="${appNameGradientStyle}">${APP_INFO.name}</span>`

  return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #333;">Thank You for Registering!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Dear ${prefix} ${name},</p>
          <p>Thank you for registering your interest with ${appNameWithStyle}. We're excited to have you on board!</p>
          <p>We have successfully received your details. A member of our matchmaking team will review your information and contact you as soon as possible to discuss the next steps.</p>
          <p>In the meantime, you can get started by creating your account. Please click the button below to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${BASE_URL}/auth?mode=register" style="background-image: linear-gradient(to right, #cfa14f, #cb5d7a); color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Register Your Account</a>
          </div>
          <p>Best regards,<br>${APP_INFO.name} Team</p>
        </div>
        <div style="background-color: #f4f4f4; color: #666; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin-bottom: 10px; font-style: italic;">This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} <a href="${BASE_URL}" style="text-decoration: none;">${appNameWithStyle}</a>. All rights reserved.</p>
        </div>
      </div>
    `
}

export const getAdminNotificationHtml = (
  details: AdminNotificationDetails
): string => {
  const appNameWithStyle = `<span style="${appNameGradientStyle}">${APP_INFO.name}</span>`

  return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <h1 style="color: #333;">New Interest Registration</h1>
        </div>
        <div style="padding: 20px;">
          <p>A new user has registered their interest on ${appNameWithStyle}.</p>
          <h2 style="border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 20px;">User Details</h2>
          <p><strong>Name:</strong> ${details.prefix} ${details.name}</p>
          <p><strong>Date of Birth:</strong> ${new Date(details.birthday).toLocaleDateString()} (Age: ${details.age})</p>
          <p><strong>Gender:</strong> ${details.gender}</p>
          <p><strong>Nationality:</strong> ${details.nationality}</p>
          <p><strong>Location:</strong> ${details.location}</p>
          <p><strong>Email:</strong> <a href="mailto:${details.email}">${details.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${details.phone}">${details.phone}</a></p>
        </div>
        <div style="background-color: #f4f4f4; color: #666; padding: 15px; text-align: center; font-size: 12px;">
          <p>This is an automated notification from your website.</p>
        </div>
      </div>
    `
}
