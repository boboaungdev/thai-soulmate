import { redirect } from "next/navigation"

interface AccountPageProps {
  params: Promise<{
    account: string
  }>
}

export default async function AccountRootPage({ params }: AccountPageProps) {
  const { account } = await params
  redirect(`/dashboard/email/${account}/inbox`)
}
