import nodemailer from "nodemailer"

import { NODEMAILER } from "@/constants"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER.user,
    pass: NODEMAILER.pass,
  },
})
