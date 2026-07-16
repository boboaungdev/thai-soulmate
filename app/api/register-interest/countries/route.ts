import { NextResponse } from "next/server"

interface Country {
  name: string
  demonym: string
  callingCodes: string[]
  alpha2Code: string
  flag: string
}

interface CountryOption {
  name: string
  nationality: string
  flag: string
  code: string
  callCode: string
}

export async function GET() {
  try {
    const response = await fetch("https://countries.dev/countries", {
      next: {
        revalidate: 86400,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch countries")
    }

    const data: Country[] = await response.json()

    const countries: CountryOption[] = Array.from(
      new Map(
        data
          .filter((country) => country.demonym)
          .map((country) => [
            country.demonym,
            {
              name: country.name,
              nationality: country.demonym,
              flag: country.flag,
              code: country.alpha2Code,
              callCode: country.callingCodes?.[0] ?? "",
            },
          ])
      ).values()
    ).sort((a, b) => a.nationality.localeCompare(b.nationality))

    return NextResponse.json(countries)
  } catch (error) {
    console.error("Countries API error:", error)

    return NextResponse.json(
      { error: "Unable to load countries" },
      { status: 500 }
    )
  }
}