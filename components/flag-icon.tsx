import { SVGProps } from "react"

export function GBFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
      <clipPath id="a">
        <path d="M0 0h60v30H0z" />
      </clipPath>
      <clipPath id="b">
        <path d="M30 15 60 0v30L30 15z" />
      </clipPath>
      <g clipPath="url(#a)">
        <path d="M0 0v30h60V0z" fill="#00247d" />
        <path d="M0 0v30h60V0z" fill="#00247d" />
        <path d="m60 30-60-30m60 0-60 30" stroke="#fff" strokeWidth={6} />
        <path
          d="m60 30-60-30m60 0-60 30"
          clipPath="url(#b)"
          stroke="#cf142b"
          strokeWidth={4}
        />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth={10} />
        <path d="M30 0v30M0 15h60" stroke="#cf142b" strokeWidth={6} />
      </g>
    </svg>
  )
}

export function THFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" {...props}>
      <path d="M0 0h60v30H0z" fill="#fff" />
      <path d="M0 0h60v5H0zm0 25h60v5H0z" fill="#a51931" />
      <path d="M0 10h60v10H0z" fill="#2d2a4a" />
    </svg>
  )
}
