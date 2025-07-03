/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      useCache: true  
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
            }
        ],
    }
};

export default nextConfig;
