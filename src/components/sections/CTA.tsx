'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import siteData from '@/content/site.json';

export function CTA() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {siteData.cta.headline}
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            {siteData.cta.subheadline}
          </p>

          <Button 
            size="lg" 
            onClick={scrollToContact}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold group transition-all duration-300"
          >
            {siteData.cta.button}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}