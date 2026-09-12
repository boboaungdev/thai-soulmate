import countriesData from "./data/countries.json"

export interface Country {
  name: string
  nationality: string
  flag: string
  code: string
  callCode: string
  region: string
}

export type CustomCountry = Country

export const COUNTRIES: Country[] = countriesData as Country[]

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
