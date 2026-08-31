export const EMAIL_REGEX = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/

export function extractCleanEmail(input: string): string {
  if (!input) return ""
  const match = input.match(/<([^>]+)>/)
  if (match && match[1]) {
    return match[1].trim().toLowerCase()
  }
  return input.trim().toLowerCase()
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
  fromRaw?: any,
  headersFrom?: any
): { name: string | null; email: string } {
  let candidate = ""

  if (typeof headersFrom === "string") {
    candidate = headersFrom
  } else if (Array.isArray(headersFrom) && headersFrom.length > 0) {
    const first = headersFrom[0]
    candidate =
      typeof first === "string"
        ? first
        : first?.text || first?.name || first?.value || ""
  } else if (headersFrom && typeof headersFrom === "object") {
    if (headersFrom.name && (headersFrom.address || headersFrom.email)) {
      const name = String(headersFrom.name)
        .trim()
        .replace(/^["']|["']$/g, "")
      const email = extractCleanEmail(headersFrom.address || headersFrom.email)
      return { name: name || null, email }
    }
    candidate = headersFrom.text || headersFrom.value || ""
  }

  if (!candidate && typeof fromRaw === "string") {
    candidate = fromRaw
  }

  if (!candidate) {
    return { name: null, email: "unknown@example.com" }
  }

  const match = candidate.match(/(.*?)\s*<([^>]+)>/)
  if (match) {
    const rawName = match[1]
      .trim()
      .replace(/^["']|["']$/g, "")
      .trim()
    const email = match[2].trim()
    return {
      name: rawName || null,
      email: extractCleanEmail(email),
    }
  }

  const clean = candidate.trim().replace(/^["']|["']$/g, "")
  if (clean.includes("@")) {
    return { name: null, email: extractCleanEmail(clean) }
  }

  return {
    name: clean || null,
    email: typeof fromRaw === "string" ? extractCleanEmail(fromRaw) : clean,
  }
}
