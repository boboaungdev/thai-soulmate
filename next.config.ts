import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
    ],
  },
}

export default nextConfig
