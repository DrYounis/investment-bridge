import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'],
      },
      // Explicitly welcome AI answer-engine crawlers (GEO)
      { userAgent: 'GPTBot', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
      { userAgent: 'Claude-Web', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
      { userAgent: 'Google-Extended', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
      { userAgent: 'Bingbot', allow: '/', disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'] },
    ],
    sitemap: 'https://www.marfa.sa/sitemap.xml',
  };
}
