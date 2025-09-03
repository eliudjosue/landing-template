import { MetadataRoute } from 'next'
import siteData from '@/content/site.json'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${siteData.site.url}/sitemap.xml`,
  }
}