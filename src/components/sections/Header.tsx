'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Nav } from '@/types/content';

interface HeaderProps {
  nav: Nav;
}

export default function Header({ nav }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="#inicio" 
            className="text-xl font-bold text-[var(--fg)] hover:text-[var(--brand)] transition-colors"
          >
            {nav.logoText}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {nav.links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-[var(--fg)] hover:text-[var(--brand)] transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[var(--fg)] hover:text-[var(--brand)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-[var(--muted)] py-4">
            <nav className="flex flex-col space-y-4">
              {nav.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-[var(--fg)] hover:text-[var(--brand)] transition-colors duration-200 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}