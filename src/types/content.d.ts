export interface NavItem {
  label: string;
  href: string;
}

export interface Nav {
  logoText: string;
  links: NavItem[];
}

export interface CTA {
  label: string;
  href: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  primaryCta: CTA;
  secondaryCta: CTA;
  image: string;
  enabled: boolean;
}

export interface Feature {
  title: string;
  desc: string;
  icon: string;
}

export interface Features {
  title: string;
  items: Feature[];
  enabled: boolean;
}

export interface Testimonial {
  name: string;
  quote: string;
}

export interface Testimonials {
  title: string;
  items: Testimonial[];
  enabled: boolean;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQ {
  title: string;
  items: FAQItem[];
  enabled: boolean;
}

export interface Contact {
  title: string;
  successMsg: string;
  enabled: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface Footer {
  legal: string;
  links: FooterLink[];
}

export interface SiteContent {
  nav: Nav;
  hero: Hero;
  features: Features;
  testimonials: Testimonials;
  faq: FAQ;
  contact: Contact;
  footer: Footer;
}

export interface Theme {
  colors: {
    brand: string;
    bg: string;
    fg: string;
    muted: string;
    card: string;
  };
  radii: {
    xl: string;
    lg: string;
    md: string;
  };
  font: {
    heading: string;
    body: string;
  };
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  ip?: string;
  userAgent?: string;
}