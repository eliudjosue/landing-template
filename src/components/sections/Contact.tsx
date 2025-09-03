'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import type { Contact } from '@/types/content';
import { trackEvent } from '@/lib/analytics';

interface ContactProps {
  contact: Contact;
}

export default function ContactSection({ contact }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Hidden field for bot protection
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!contact.enabled) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el mensaje');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      trackEvent('form_submit', { form_name: 'contact' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (status === 'success') {
    return (
      <section id="contacto" className="py-20 bg-[var(--bg)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-[var(--card)] border-[var(--brand)] rounded-[var(--radius-xl)]">
            <CardContent className="p-12">
              <CheckCircle className="text-[var(--brand)] mx-auto mb-6" size={64} />
              <h2 className="text-2xl font-bold text-[var(--fg)] mb-4">
                ¡Mensaje enviado!
              </h2>
              <p className="text-[var(--fg)]/80 text-lg">
                {contact.successMsg}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="py-20 bg-[var(--bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--fg)] mb-4">
            {contact.title}
          </h2>
        </div>

        <Card className="bg-[var(--card)] border-[var(--muted)] rounded-[var(--radius-xl)]">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="space-y-2">
                <Label htmlFor="name" className="text-[var(--fg)] font-medium flex items-center gap-2">
                  <User size={16} />
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-[var(--bg)] border-[var(--muted)] text-[var(--fg)] focus:border-[var(--brand)] rounded-[var(--radius-md)]"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--fg)] font-medium flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[var(--bg)] border-[var(--muted)] text-[var(--fg)] focus:border-[var(--brand)] rounded-[var(--radius-md)]"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[var(--fg)] font-medium flex items-center gap-2">
                  <MessageSquare size={16} />
                  Mensaje
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-[var(--bg)] border-[var(--muted)] text-[var(--fg)] focus:border-[var(--brand)] rounded-[var(--radius-md)]"
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-[var(--radius-md)] border border-red-500/20">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-[1.02] rounded-[var(--radius-md)]"
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}