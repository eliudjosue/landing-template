import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Hero } from '../../types/content';
// or update the path to the correct location of your Hero type

interface HeroProps {
  hero: Hero;
}

export default function HeroSection({ hero }: HeroProps) {
  if (!hero.enabled) return null;

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center bg-[var(--bg)] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--fg)] leading-tight">
                {hero.title}
              </h1>
              <p className="text-xl text-[var(--fg)]/80 leading-relaxed">
                {hero.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 rounded-[var(--radius-lg)]"
              >
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-[var(--muted)] text-[var(--fg)] hover:bg-[var(--muted)] px-8 py-4 text-lg transition-all duration-300 rounded-[var(--radius-lg)]"
              >
                <Link href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] shadow-2xl">
              <Image
                src={hero.image}
                alt="Hero image"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)]/20 to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--brand)]/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--brand)]/10 rounded-full blur-2xl animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}