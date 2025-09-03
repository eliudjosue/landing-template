import React from 'react';
import Link from 'next/link';
import type { Footer } from '@/types/content';

interface FooterProps {
  footer: Footer;
}

export default function FooterSection({ footer }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const legalText = footer.legal.replace('{{year}}', currentYear.toString());

  return (
    <footer className="py-12 bg-[var(--card)] border-t border-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--fg)]/70 text-sm">
            {legalText}
          </p>
          
          {footer.links.length > 0 && (
            <div className="flex items-center gap-6">
              {footer.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-[var(--fg)]/70 hover:text-[var(--brand)] transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}