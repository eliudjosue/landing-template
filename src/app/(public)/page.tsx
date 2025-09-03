import { generateSEO, generateJSONLD } from '@/lib/seo';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { FAQ } from '@/components/sections/FAQ';
import { ContactForm } from '@/components/sections/ContactForm';
import { Footer } from '@/components/sections/Footer';

export const metadata = generateSEO();

export default function Home() {
  const jsonLd = generateJSONLD();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
        <FAQ />
        <ContactForm />
        <Footer />
      </main>
    </>
  );
}