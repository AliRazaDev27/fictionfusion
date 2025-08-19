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
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
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
                    expiration: {
                        maxEntries: 50,                // keep up to 50 files
                        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                    },
                },
            },
        ]
    }
});

export default withPWA(nextConfig);
