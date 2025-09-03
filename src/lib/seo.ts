import type { Metadata } from 'next'
import siteData from '@/content/site.json'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function generateSEO({
  title,
  description,
  image = '/og-image.jpg',
  url = ''
}: SEOProps = {}): Metadata {
  const siteTitle = title ? `${title} | ${siteData.site.name}` : siteData.site.name
  const siteDescription = description || siteData.site.description
  const siteUrl = `${siteData.site.url}${url}`

  return {
    title: siteTitle,
    description: siteDescription,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: siteUrl,
      siteName: siteData.site.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}

export function generateJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteData.site.name,
    url: siteData.site.url,
    logo: `${siteData.site.url}/logo.png`,
    description: siteData.site.description,
    email: siteData.site.email,
    telephone: siteData.site.phone,
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
  }
}