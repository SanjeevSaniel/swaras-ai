// src/app/sitemap.js - Dynamic sitemap generation

export default function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://tryswarai.vercel.app/';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];
}
