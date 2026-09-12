import { MatchComparisonView } from "@/features/matching"

type MatchComparisonPageProps = {
  params: Promise<{
    maleId: string
    femaleId: string
  }>
}

export default async function MatchComparisonPage({
  params,
}: MatchComparisonPageProps) {
  const { maleId, femaleId } = await params
  return <MatchComparisonView maleId={maleId} femaleId={femaleId} />
}
