/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
    },
    cacheComponents: true,
    serverExternalPackages: ['impit'],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "covers.openlibrary.org",
            },
            {
                protocol: "https",
                hostname: "image.tmdb.org",
            },
            {
                protocol: "https",
                hostname: "static.tvmaze.com"
            },
            {
                protocol: "https",
                hostname: "i.mydramalist.com"
            },
            {
                protocol: "http",
                hostname: "books.google.com"
            },
            {
                protocol: "https",
                hostname: "image.tmdb.org"
            },
            {
                protocol: "https",
                hostname: "static.tvmaze.com"
            },
            {
                protocol: "https",
                hostname: "images.thegreatestbooks.org"
            },
        ],
    }
};

export default nextConfig;
