/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "firebase.google.com" }],
  },
};

export default nextConfig;
