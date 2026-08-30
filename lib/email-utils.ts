export const EMAIL_REGEX = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/

export function extractCleanEmail(input: string): string {
  if (!input) return ""
  const match = input.match(/<([^>]+)>/)
  if (match && match[1]) {
    return match[1].trim()
  }
  return input.trim()
}

export function parseEmailsFromInput(input?: string | string[]): string[] {
  if (!input) return []
  if (Array.isArray(input)) {
    return input.map(extractCleanEmail).filter(Boolean)
  }

  const str = input.trim()
  if (!str) return []

  const angleBracketMatches = [...str.matchAll(/<([^>]+)>/g)]
  if (angleBracketMatches.length > 0) {
    return angleBracketMatches.map((m) => m[1].trim()).filter(Boolean)
  }

  return str
    .split(/[,\s;]+/)
    .map((e) => extractCleanEmail(e))
    .filter(Boolean)
}

export function parseSenderNameAndEmail(
  fromRaw?: string | null,
  headersFrom?: string | null
): { name: string | null; email: string } {
  const candidate = headersFrom || fromRaw || ""
  if (!candidate) return { name: null, email: "unknown@example.com" }

  const match = candidate.match(/(.*?)\s*<(.+)>/)
  if (match) {
    const name = match[1].trim().replace(/^["']|["']$/g, "")
    const email = match[2].trim()
    return { name: name || null, email }
  }

  const clean = candidate.trim().replace(/^["']|["']$/g, "")
  if (clean.includes("@")) {
    return { name: null, email: clean }
  }
  return { name: clean || null, email: fromRaw || clean }
}
