'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { FAQ } from '@/types/content';

interface FAQProps {
  faq: FAQ;
}

export default function FAQSection({ faq }: FAQProps) {
  if (!faq.enabled) return null;

  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section id="faq" className="py-20 bg-[var(--card)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-4">
            {faq.title}
          </h2>
        </div>

        <div className="space-y-4">
          {faq.items.map((item, index) => {
            const isOpen = openItems.has(index);
            
            return (
              <Card 
                key={index}
                className="bg-[var(--bg)] border-[var(--muted)] rounded-[var(--radius-lg)]"
              >
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-[var(--muted)]/20 transition-colors duration-200 rounded-[var(--radius-lg)]"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-lg font-semibold text-[var(--fg)] pr-4">
                      {item.q}
                    </h3>
                    <ChevronDown 
                      className={`text-[var(--brand)] transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <p className="text-[var(--fg)]/80 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}