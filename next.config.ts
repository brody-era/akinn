import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:all*(mp4|webm|mov)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(png|jpg|jpeg|gif|webp|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'beta.akinn.xyz',
          },
        ],
        destination: '/beta',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;