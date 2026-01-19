/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable all caching in development
    ...(process.env.NODE_ENV === 'development' && {
        experimental: {
            isrMemoryCacheSize: 0, // Disable ISR cache
        },
    }),
    // Disable image optimization cache
    images: {
        unoptimized: true,
    },
}

export default nextConfig
