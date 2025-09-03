import { z } from 'zod';
import type { SiteContent } from '@/types/content';
import siteData from '@/content/site.json';

const CTASchema = z.object({
  label: z.string(),
  href: z.string(),
});

const NavItemSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const NavSchema = z.object({
  logoText: z.string(),
  links: z.array(NavItemSchema),
});

const HeroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  primaryCta: CTASchema,
  secondaryCta: CTASchema,
  image: z.string(),
  enabled: z.boolean().default(true),
});

const FeatureSchema = z.object({
  title: z.string(),
  desc: z.string(),
  icon: z.string(),
});

const FeaturesSchema = z.object({
  title: z.string(),
  items: z.array(FeatureSchema),
  enabled: z.boolean().default(true),
});

const TestimonialSchema = z.object({
  name: z.string(),
  quote: z.string(),
});

const TestimonialsSchema = z.object({
  title: z.string(),
  items: z.array(TestimonialSchema),
  enabled: z.boolean().default(true),
});

const FAQItemSchema = z.object({
  q: z.string(),
  a: z.string(),
});

const FAQSchema = z.object({
  title: z.string(),
  items: z.array(FAQItemSchema),
  enabled: z.boolean().default(true),
});

const ContactSchema = z.object({
  title: z.string(),
  successMsg: z.string(),
  enabled: z.boolean().default(true),
});

const FooterLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const FooterSchema = z.object({
  legal: z.string(),
  links: z.array(FooterLinkSchema),
});

const SiteContentSchema = z.object({
  nav: NavSchema,
  hero: HeroSchema,
  features: FeaturesSchema,
  testimonials: TestimonialsSchema,
  faq: FAQSchema,
  contact: ContactSchema,
  footer: FooterSchema,
});

export function getContent(): SiteContent {
  try {
    const parsed = SiteContentSchema.parse(siteData);
    return parsed;
  } catch (error) {
    console.error('Error parsing site content:', error);
    // Return default content if parsing fails
    return getDefaultContent();
  }
}

function getDefaultContent(): SiteContent {
  return {
    nav: {
      logoText: 'TuMarca',
      links: [
        { label: 'Inicio', href: '#inicio' },
        { label: 'Contacto', href: '#contacto' }
      ]
    },
    hero: {
      title: 'Impulsá tu marca',
      subtitle: 'Landing moderna y efectiva',
      primaryCta: { label: 'Contactar', href: '#contacto' },
      secondaryCta: { label: 'Ver más', href: '#features' },
      image: '/hero-placeholder.jpg',
      enabled: true,
    },
    features: {
      title: 'Nuestros servicios',
      items: [],
      enabled: true,
    },
    testimonials: {
      title: 'Testimonios',
      items: [],
      enabled: true,
    },
    faq: {
      title: 'FAQ',
      items: [],
      enabled: true,
    },
    contact: {
      title: 'Contacto',
      successMsg: 'Gracias por tu mensaje',
      enabled: true,
    },
    footer: {
      legal: '© 2024 TuMarca. Todos los derechos reservados.',
      links: [],
    },
  };
}