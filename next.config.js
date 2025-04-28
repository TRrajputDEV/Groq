/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Make sure server components can access environment variables
    experimental: {
        serverActions: true,
    },
    eslint: {
        // Disable ESLint during builds
        ignoreDuringBuilds: true,
    },

};

module.exports = nextConfig;