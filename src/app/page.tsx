import React from 'react';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/Hero';
import FeaturesSection from '@/components/sections/Features';
import TestimonialsSection from '@/components/sections/Testimonials';
import FAQSection from '@/components/sections/FAQ';
import ContactSection from '@/components/sections/Contact';
import FooterSection from '@/components/sections/Footer';
import { getContent } from '@/lib/content';
import { generateMetadata as generateSEOMetadata, generateJSONLD } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'TuMarca - Landing pages que convierten',
  description: 'Impulsá tu marca con una landing moderna, rápida y lista para convertir. Entrega en 24h con todo lo necesario para hacer crecer tu negocio.',
});

export default function HomePage() {
  const content = getContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJSONLD()) }}
      />
      
      {/* Skip to content link for accessibility */}
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--brand)] text-white px-4 py-2 rounded-[var(--radius-md)] z-50"
      >
        Saltar al contenido principal
      </a>

      <Header nav={content.nav} />
      
      <main>
        <HeroSection hero={content.hero} />
        <FeaturesSection features={content.features} />
        <TestimonialsSection testimonials={content.testimonials} />
        <FAQSection faq={content.faq} />
        <ContactSection contact={content.contact} />
      </main>
      
      <FooterSection footer={content.footer} />
    </>
  );
}