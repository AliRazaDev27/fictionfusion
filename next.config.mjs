/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig = {
    experimental: {
        useCache: true,
        ppr: "incremental",
    },
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

const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === 'development', // 👈 disables in dev
    cacheOnFrontEndNav: true,
    extendDefaultRuntimeCaching: true,
    workboxOptions: {
        runtimeCaching: [
            {
                urlPattern: /\/music/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'music-cache',
                    expiration: {
                        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            {
                // Match Cloudinary media files
                urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\.(?:mp3|ogg|wav|mp4|webm)$/i,
                handler: "CacheFirst",
                options: {
                    cacheName: "cloudinary-media",
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
        ]
    }
});

export default withPWA(nextConfig);
