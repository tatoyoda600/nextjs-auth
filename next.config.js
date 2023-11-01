const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require("next/constants")

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      SECRET: "IhIu2pgshDrPtjO2J+jGUiPexjJZov9NZhhL+4nvbj8=",
      NEXTAUTH_URL: "http://localhost:3000/"
    }
  };

module.exports = nextConfig
