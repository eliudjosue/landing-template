import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import type { Testimonials } from '@/types/content';

interface TestimonialsProps {
  testimonials: Testimonials;
}

export default function TestimonialsSection({ testimonials }: TestimonialsProps) {
  if (!testimonials.enabled) return null;

  return (
    <section id="testimonials" className="py-20 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-4">
            {testimonials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.items.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-[var(--card)] border-[var(--muted)] hover:border-[var(--brand)]/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl rounded-[var(--radius-lg)]"
            >
              <CardContent className="p-6">
                <Quote className="text-[var(--brand)] mb-4" size={24} />
                <blockquote className="text-[var(--fg)]/90 mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <cite className="text-[var(--brand)] font-semibold">
                  — {testimonial.name}
                </cite>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}