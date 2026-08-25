export const BUSINESS_HOUR_START = 8
export const BUSINESS_HOUR_END = 18

export const PREFERRED_CONTACT_START_HOURS = Array.from(
  { length: BUSINESS_HOUR_END - BUSINESS_HOUR_START },
  (_, index) => BUSINESS_HOUR_START + index
)

export function formatHourLabel(hour: number) {
  return `${hour}:00`
}

export function getPreferredContactEndHours(startHour: number) {
  if (
    !Number.isInteger(startHour) ||
    startHour < BUSINESS_HOUR_START ||
    startHour >= BUSINESS_HOUR_END
  ) {
    return []
  }

  return Array.from(
    { length: BUSINESS_HOUR_END - startHour },
    (_, index) => startHour + index + 1
  )
}

export function toPreferredContactTime(startHour: number, endHour: number) {
  return `${String(startHour).padStart(2, "0")}:00-${String(endHour).padStart(2, "0")}:00`
}

export function parsePreferredContactTime(value: string) {
  const match = /^(\d{2}):00-(\d{2}):00$/.exec(value)

  if (!match) return null

  return {
    startHour: Number(match[1]),
    endHour: Number(match[2]),
  }
}

export function isValidPreferredContactTime(value: string) {
  const parsed = parsePreferredContactTime(value)

  if (!parsed) return false

  const { startHour, endHour } = parsed

  return (
    startHour >= BUSINESS_HOUR_START &&
    endHour <= BUSINESS_HOUR_END &&
    startHour < endHour
  )
}

export function formatPreferredContactTime(value: string | null | undefined) {
  const parsed = value ? parsePreferredContactTime(value) : null

  if (!parsed) return value || "-"

  return `${formatHourLabel(parsed.startHour)}–${formatHourLabel(parsed.endHour)}`
}
