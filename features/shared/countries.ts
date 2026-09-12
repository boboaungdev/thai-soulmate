import countriesJson from "@/data/countries.json"

export interface Country {
  name: string
  nationality: string
  flag: string
  code: string
  callCode: string
  region: string
}

export type CustomCountry = Country

export const COUNTRIES: Country[] = (countriesJson as any[])
  .filter((c) => c.name && c.alpha2Code)
  .map((c) => ({
    name: c.name as string,
    nationality: (c.demonym || c.name) as string,
    flag: (c.flags?.svg || c.flags?.png || "") as string,
    code: c.alpha2Code as string,
    callCode: String(c.callingCodes?.[0] ?? "").replace(/^\+/, ""),
    region: (c.region || "") as string,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function getCountries(): Country[] {
  return COUNTRIES
}

export function findCountryByCode(code: string): Country | undefined {
  if (!code) return undefined
  return COUNTRIES.find((c) => c.code.toLowerCase() === code.toLowerCase())
}

export function findCountryByName(name: string): Country | undefined {
  if (!name) return undefined
  return COUNTRIES.find((c) => c.name.toLowerCase() === name.toLowerCase())
}
