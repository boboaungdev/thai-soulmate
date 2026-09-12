import { AuthPageGuard } from "@/features/auth"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthPageGuard>{children}</AuthPageGuard>
}
