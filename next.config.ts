import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium"],

  outputFileTracingIncludes: {
    "/api/tracking/**": ["./node_modules/@sparticuz/chromium/**/*"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "pub-0d5b5771c8f8496e96d738e9b1f81daa.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
