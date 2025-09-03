import type { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tumarca.com';
  const fullUrl = config.url ? `${siteUrl}${config.url}` : siteUrl;
  const image = config.image || `${siteUrl}/og-image.jpg`;

  return {
    title: config.title,
    description: config.description,
    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      siteName: 'TuMarca',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateJSONLD() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tumarca.com';
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'TuMarca',
        url: siteUrl,
        sameAs: [],
        logo: {
          '@type': 'ImageObject',
          '@id': `${siteUrl}/#logo`,
          url: `${siteUrl}/logo.png`,
          contentUrl: `${siteUrl}/logo.png`,
          width: 512,
          height: 512,
          caption: 'TuMarca',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'TuMarca',
        description: 'Landing pages modernas que convierten',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        inLanguage: 'es-ES',
      },
    ],
  };
}