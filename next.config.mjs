/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[{
            protocol:"https",
            hostname:"covers.openlibrary.org",
        },
    {
        protocol:"https",
        hostname:"image.tmdb.org",
    },
{
    protocol:"https",
    hostname:"static.tvmaze.com"
}],
    }
};

export default nextConfig;
