import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Features } from '@/types/content';

interface FeaturesProps {
  features: Features;
}

export default function FeaturesSection({ features }: FeaturesProps) {
  if (!features.enabled) return null;

  return (
    <section id="features" className="py-20 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-4">
            {features.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.items.map((feature, index) => {
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.Star;
            
            return (
              <Card 
                key={index}
                className="bg-[var(--bg)] border-[var(--muted)] hover:border-[var(--brand)]/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl group rounded-[var(--radius-lg)]"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[var(--brand)]/10 rounded-[var(--radius-lg)] flex items-center justify-center group-hover:bg-[var(--brand)]/20 transition-colors duration-300">
                    <IconComponent 
                      size={32} 
                      className="text-[var(--brand)] group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--fg)] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}