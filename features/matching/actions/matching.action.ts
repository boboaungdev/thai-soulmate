"use server"

import { MatchingService } from "../services/matching.service"
import { GetMatchesOptions } from "../types"

export async function getMatchesAction(options: GetMatchesOptions) {
  try {
    const matches = await MatchingService.calculateMatches(options)
    return { success: true, matches }
  } catch (error) {
    console.error("getMatchesAction error:", error)
    return {
      success: false,
      matches: [],
      error: error instanceof Error ? error.message : "Failed to calculate matches",
    }
  }
}

export async function getMatchComparisonAction(maleId: string, femaleId: string) {
  try {
    return await MatchingService.getMatchComparison(maleId, femaleId)
  } catch (error) {
    console.error("getMatchComparisonAction error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get comparison",
    }
  }
}

