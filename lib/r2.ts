import { R2 } from "@/constants"
import { S3Client } from "@aws-sdk/client-s3"

export const r2 = new S3Client({
  region: "auto",
  endpoint: R2.R2_ENDPOINT,
  credentials: {
    accessKeyId: R2.R2_ACCESS_KEY_ID!,
    secretAccessKey: R2.R2_SECRET_ACCESS_KEY!,
  },
})
