import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'bs.floristic.org' },
      { protocol: 'https', hostname: 'bs.plantnet.org' },
      { protocol: 'https', hostname: 'd2seqvvyy3b8p2.cloudfront.net' },
      { protocol: 'https', hostname: 'perenual.com' },
      { protocol: 'https', hostname: '**.wasabisys.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '**.wikipedia.org' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'plant.id' },
      { protocol: 'https', hostname: '**.plant.id' },
      { protocol: 'https', hostname: 'gnews.io' },
      { protocol: 'https', hostname: 'images.mobot.org' },
      { protocol: 'http', hostname: 'images.mobot.org' },
    ],
  },
};

export default nextConfig;
