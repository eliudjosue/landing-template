import { MetadataRoute } from 'next'
import siteData from '@/content/site.json'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteData.site.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}