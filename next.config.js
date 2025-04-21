/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Disable ESLint during builds
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;