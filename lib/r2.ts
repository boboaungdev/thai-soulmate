import { S3Client } from "@aws-sdk/client-s3"
import { env } from "./env"

export const r2 = new S3Client({
  region: "auto",
  endpoint: env.R2.ENDPOINT,
  credentials: {
    accessKeyId: env.R2.ACCESS_KEY_ID!,
    secretAccessKey: env.R2.SECRET_ACCESS_KEY!,
  },
})
