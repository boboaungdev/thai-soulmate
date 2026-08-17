import { NextResponse } from "next/server"

interface Country {
  name: string
  demonym?: string
  callingCodes?: string[]
  alpha2Code: string
  flags: {
    png: string
    svg: string
  }
  region: string
}

interface CustomCountry {
  name: string
  nationality: string
  flag: string
  code: string
  callCode: string
  region: string
}

export async function GET() {
  try {
    const response = await fetch("https://countries.dev/countries", {
      next: {
        revalidate: 86400,
      },
    })

    if (!response.ok) {
      throw new Error("Failed fetching countries")
    }

    const data: Country[] = await response.json()

    const countries: CustomCountry[] = data
      .filter(
        (country) => country.name && country.alpha2Code && country.flags?.svg
      )
      .map((country) => ({
        name: country.name,
        nationality: country.demonym || country.name,
        flag: country.flags.svg,
        code: country.alpha2Code,
        callCode: country.callingCodes?.[0] ?? "",
        region: country.region,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(countries)
  } catch (error) {
    console.error("Countries API error:", error)

    return NextResponse.json(
      {
        error: "Unable to load countries",
      },
      {
        status: 500,
      }
    )
  }
}
