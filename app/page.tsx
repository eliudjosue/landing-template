'use client';

import { useState } from 'react';

import theme from '../src/content/theme.json';
import site from '../src/content/site.json';
type LeadPayload = { name: string; email: string; message: string; honeypot?: string };

export default function Home() {
  const [ok, setOk] = useState<boolean | null>(null);

  // set vars from theme.json
  const vars = {
    ['--brand' as any]: theme.colors.brand,
    ['--bg' as any]: theme.colors.bg,
    ['--fg' as any]: theme.colors.fg,
    ['--muted' as any]: theme.colors.muted,
    ['--card' as any]: theme.colors.card,
    ['--r-xl' as any]: theme.radii.xl,
    ['--r-lg' as any]: theme.radii.lg,
    ['--r-md' as any]: theme.radii.md,
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: LeadPayload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      message: String(fd.get('message') || ''),
      honeypot: '',
    };
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setOk(res.ok);
      if (res.ok) (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setOk(false);
    }
  }

  return (
    <main style={vars as any} className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold">{site.nav?.logoText ?? 'TuMarca'}</div>
          <nav className="hidden md:flex gap-6 text-sm">
            {site.nav?.links?.map((l) => (
              <a key={l.href} href={l.href} className="opacity-80 hover:opacity-100">
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#contacto" className="px-4 py-2 rounded-2xl bg-[var(--brand)] text-black font-semibold">
            {site.hero?.primaryCta?.label ?? 'Contacto'}
          </a>
        </div>
      </header>

      {/* Hero */}
      {site.hero?.enabled !== false && (
        <section id="inicio" className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{site.hero?.title}</h1>
          <p className="text-lg md:text-xl opacity-80">{site.hero?.subtitle}</p>
          <div className="flex gap-4 justify-center pt-2">
            {site.hero?.primaryCta && (
              <a href={site.hero.primaryCta.href} className="px-6 py-3 rounded-2xl bg-[var(--brand)] text-black font-semibold">
                {site.hero.primaryCta.label}
              </a>
            )}
            {site.hero?.secondaryCta && (
              <a href={site.hero.secondaryCta.href} className="px-6 py-3 rounded-2xl border border-[var(--muted)]">
                {site.hero.secondaryCta.label}
              </a>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      {site.features?.enabled !== false && (
        <section id="features" className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{site.features?.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {site.features?.items?.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 border border-[var(--muted)] bg-[var(--card)]">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="opacity-80 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {site.testimonials?.enabled !== false && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{site.testimonials?.title}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {site.testimonials?.items?.map((t, i) => (
              <figure key={i} className="rounded-2xl p-6 border border-[var(--muted)] bg-[var(--card)]">
                <blockquote className="italic">“{t.quote}”</blockquote>
                <figcaption className="mt-3 text-sm opacity-80">— {t.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {site.faq?.enabled !== false && (
        <section id="faq" className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{site.faq?.title}</h2>
          <div className="space-y-3">
            {site.faq?.items?.map((q, i) => (
              <details key={i} className="rounded-xl border border-[var(--muted)] bg-[var(--card)] p-4">
                <summary className="cursor-pointer font-medium">{q.q}</summary>
                <p className="opacity-80 mt-2">{q.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      {site.contact?.enabled !== false && (
        <section id="contacto" className="max-w-xl mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">{site.contact?.title ?? 'Contacto'}</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input name="name" placeholder="Nombre" className="w-full px-4 py-3 rounded-xl bg-black/20 outline-none border border-[var(--muted)]" required />
            <input name="email" type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-black/20 outline-none border border-[var(--muted)]" required />
            <textarea name="message" placeholder="Mensaje (mín. 10 caracteres)" className="w-full px-4 py-3 rounded-xl bg-black/20 outline-none border border-[var(--muted)]" rows={4} required />
            {/* honeypot oculto (tu API espera "honeypot") */}
            <input name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" />
            <button className="w-full px-6 py-3 rounded-2xl bg-[var(--brand)] text-black font-semibold">Enviar</button>
          </form>
          {ok === true && <p className="mt-4 text-green-400">{site.contact?.successMsg ?? '¡Gracias! Te contactamos pronto.'}</p>}
          {ok === false && <p className="mt-4 text-red-400">Ups, algo falló. Probá de nuevo.</p>}
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[var(--muted)]">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm opacity-80">
          {site.footer?.legal?.replace('{{year}}', String(new Date().getFullYear()))}
        </div>
      </footer>
    </main>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';

// import theme from '../src/content/theme.json';
// import site from '../src/content/site.json';

// type LeadPayload = { name: string; email: string; message: string; honeypot?: string };

// export default function Home() {
//   const [ok, setOk] = useState<boolean | null>(null);
//   const [showSticky, setShowSticky] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setShowSticky(window.scrollY > 360);
//     window.addEventListener('scroll', onScroll);
//     onScroll();
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   // theme vars
//   const vars = {
//     ['--brand' as any]: theme.colors.brand,
//     ['--bg' as any]: theme.colors.bg,
//     ['--fg' as any]: theme.colors.fg,
//     ['--muted' as any]: theme.colors.muted,
//     ['--card' as any]: theme.colors.card,
//     ['--r-xl' as any]: theme.radii.xl,
//     ['--r-lg' as any]: theme.radii.lg,
//     ['--r-md' as any]: theme.radii.md,
//   };

//   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const fd = new FormData(e.currentTarget);
//     const payload: LeadPayload = {
//       name: String(fd.get('name') || ''),
//       email: String(fd.get('email') || ''),
//       message: String(fd.get('message') || ''),
//       honeypot: '',
//     };
//     try {
//       const res = await fetch('/api/leads', {
//         method: 'POST',
//         headers: { 'content-type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       setOk(res.ok);
//       if (res.ok) (e.currentTarget as HTMLFormElement).reset();
//     } catch {
//       setOk(false);
//     }
//   }

//   return (
//     <main
//       style={vars as any}
//       className="min-h-screen bg-[var(--bg)] text-[var(--fg)] scroll-smooth selection:bg-[var(--brand)]/30"
//     >
//       {/* BACKDROP ORNAMENTS */}
//       <div
//         aria-hidden
//         className="pointer-events-none fixed inset-0 -z-10 [background:radial-gradient(60rem_30rem_at_20%_-10%,rgba(224,176,80,0.15),transparent_60%),radial-gradient(50rem_30rem_at_120%_10%,rgba(224,176,80,0.08),transparent_60%)]"
//       />

//       {/* HEADER — glass pill centrado */}
//       <header className="sticky top-4 z-30">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="mx-auto w-full md:w-auto md:inline-flex items-center justify-between gap-6 rounded-[2rem] border border-[var(--muted)]/50 bg-[var(--card)]/50 backdrop-blur px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
//             <div className="font-semibold tracking-wide">{site.nav?.logoText ?? 'Estudio Jurídico'}</div>
//             <nav className="hidden md:flex gap-5 text-sm">
//               {site.nav?.links?.map((l) => (
//                 <a key={l.href} href={l.href} className="opacity-80 hover:opacity-100 hover:underline underline-offset-4">
//                   {l.label}
//                 </a>
//               ))}
//             </nav>
//             <a
//               href="#contacto"
//               className="ml-auto md:ml-0 inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-[var(--brand)] text-black font-semibold hover:brightness-110 transition"
//             >
//               {site.hero?.primaryCta?.label ?? 'Agendar consulta'}
//             </a>
//           </div>
//         </div>
//       </header>

//       {/* HERO — full-bleed con overlay y marco de imagen */}
//       {site.hero?.enabled !== false && (
//         <section id="inicio" className="relative">
//           {/* fondo con imagen si existe */}
//           {site.hero?.image && (
//             <div
//               className="absolute inset-0 -z-10 opacity-25"
//               style={{ backgroundImage: `url(${site.hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//             />
//           )}
//           <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-36 pb-16 grid md:grid-cols-2 gap-10 items-center">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-[var(--muted)] bg-[var(--card)] px-3 py-1 text-xs opacity-90">
//                 {site.nav?.logoText ?? 'Estudio Jurídico'} • Respuesta en 24 h
//               </div>
//               <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight">
//                 {site.hero?.title}
//               </h1>
//               <p className="mt-4 text-lg md:text-xl opacity-90 leading-relaxed">
//                 {site.hero?.subtitle}
//               </p>
//               <div className="mt-6 flex flex-wrap gap-3">
//                 {site.hero?.primaryCta && (
//                   <a
//                     href={site.hero.primaryCta.href}
//                     className="px-6 py-3 rounded-2xl bg-[var(--brand)] text-black font-semibold shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:translate-y-[-1px] transition"
//                   >
//                     {site.hero.primaryCta.label}
//                   </a>
//                 )}
//                 {site.hero?.secondaryCta && (
//                   <a
//                     href={site.hero.secondaryCta.href}
//                     className="px-6 py-3 rounded-2xl border border-[var(--muted)] bg-[var(--card)]/70 backdrop-blur hover:bg-[var(--card)] transition"
//                   >
//                     {site.hero.secondaryCta.label}
//                   </a>
//                 )}
//               </div>
//             </div>

//             {/* marco de imagen/escena */}
//             <div className="relative">
//               <div className="relative aspect-[4/3] rounded-[var(--r-xl)] p-[2px] bg-gradient-to-br from-[var(--brand)]/60 via-[var(--brand)]/20 to-transparent">
//                 <div className="h-full w-full rounded-[var(--r-xl)] bg-[var(--card)] overflow-hidden">
//                   <img
//                     src={site.hero?.image || 'https://images.unsplash.com/photo-1555371363-21d3b4bdbf4a?q=80&w=1200&auto=format&fit=crop'}
//                     alt="Estudio"
//                     className="h-full w-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
//                 </div>
//               </div>
//               {/* detalles decorativos */}
//               <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-[var(--brand)]/20 blur-2xl" />
//               <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-[var(--brand)]/10 blur-2xl" />
//             </div>
//           </div>
//         </section>
//       )}

//       {/* TRUST STRIP (opcional) */}
//       {Array.isArray((site as any)?.trust?.items) && (site as any).trust.items.length > 0 && (
//         <section className="max-w-6xl mx-auto px-6 pb-6 -mt-6">
//           <div className="text-center text-sm opacity-70 mb-4">Miembro y aliado de</div>
//           <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
//             {(site as any).trust.items.map((it: any, i: number) => (
//               <img key={i} src={it.src} alt={it.alt} className="h-8 md:h-10 object-contain grayscale" />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* FEATURES / ÁREAS — tarjetas con borde degradado */}
//       {site.features?.enabled !== false && (
//         <section id="features" className="max-w-6xl mx-auto px-6 py-18 md:py-24">
//           <h2 className="text-2xl md:text-3xl font-bold mb-6">{site.features?.title}</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {site.features?.items?.map((f, i) => (
//               <div key={i} className="group rounded-2xl p-[1px] bg-gradient-to-br from-[var(--brand)]/40 via-transparent to-transparent">
//                 <div className="h-full rounded-2xl p-6 border border-[var(--muted)] bg-[var(--card)] transition group-hover:translate-y-[-2px] group-hover:shadow-xl">
//                   <div className="h-1 w-12 bg-[var(--brand)] rounded-full mb-4 opacity-80 group-hover:opacity-100 transition" />
//                   <h3 className="text-lg font-semibold">{f.title}</h3>
//                   <p className="opacity-80 mt-2 leading-relaxed">{f.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* TESTIMONIOS — tarjetas con comillas */}
//       {site.testimonials?.enabled !== false && (
//         <section id="testimonials" className="max-w-6xl mx-auto px-6 py-16">
//           <h2 className="text-2xl md:text-3xl font-bold mb-6">{site.testimonials?.title}</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {site.testimonials?.items?.map((t, i) => (
//               <figure key={i} className="relative rounded-2xl p-6 border border-[var(--muted)] bg-[var(--card)]">
//                 <div className="absolute -top-2 right-4 text-[var(--brand)] text-5xl leading-none">“</div>
//                 <blockquote className="italic leading-relaxed">“{t.quote}”</blockquote>
//                 <figcaption className="mt-4 text-sm opacity-80">— {t.name}</figcaption>
//               </figure>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* FAQ — acordeones */}
//       {site.faq?.enabled !== false && (
//         <section id="faq" className="max-w-6xl mx-auto px-6 py-16">
//           <h2 className="text-2xl md:text-3xl font-bold mb-6">{site.faq?.title}</h2>
//           <div className="space-y-3">
//             {site.faq?.items?.map((q, i) => (
//               <details key={i} className="rounded-xl border border-[var(--muted)] bg-[var(--card)] p-4 open:shadow-md open:border-[var(--brand)]/40">
//                 <summary className="cursor-pointer font-medium">
//                   {q.q}
//                 </summary>
//                 <p className="opacity-80 mt-2 leading-relaxed">{q.a}</p>
//               </details>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* CONTACTO — card con anillo degradado */}
//       {site.contact?.enabled !== false && (
//         <section id="contacto" className="max-w-6xl mx-auto px-6 py-20">
//           <div className="max-w-xl p-[1px] rounded-[var(--r-xl)] bg-gradient-to-br from-[var(--brand)]/50 via-transparent to-transparent">
//             <div className="rounded-[var(--r-xl)] border border-[var(--muted)] bg-[var(--card)] p-6 md:p-8">
//               <h2 className="text-2xl md:text-3xl font-bold mb-6">
//                 {site.contact?.title ?? 'Contacto'}
//               </h2>
//               <form onSubmit={onSubmit} className="space-y-4">
//                 <input name="name" placeholder="Nombre y apellido" className="w-full px-4 py-3 rounded-xl bg-black/20 outline-none border border-[var(--muted)]" required />
//                 <input name="email" type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-black/20 outline-none border border-[var(--muted)]" required />
//                 <textarea name="message" placeholder="Contame tu caso (mín. 10 caracteres)" className="w-full px-4 py-3 rounded-xl bg-black/20 outline-none border border-[var(--muted)]" rows={4} required />
//                 <input name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" />
//                 <button className="w-full px-6 py-3 rounded-2xl bg-[var(--brand)] text-black font-semibold hover:brightness-110 transition">
//                   Enviar consulta
//                 </button>
//               </form>
//               {ok === true && (
//                 <p className="mt-4 text-green-400">
//                   {site.contact?.successMsg ?? '¡Gracias! Te contacto a la brevedad.'}
//                 </p>
//               )}
//               {ok === false && <p className="mt-4 text-red-400">Ups, algo falló. Probá de nuevo.</p>}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* CINTA CTA */}
//       <section className="py-12">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="rounded-[var(--r-xl)] border border-[var(--muted)] bg-[var(--card)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-lg md:text-xl">Contame tu caso y recibís un plan de acción en 24 h.</p>
//             <a href="#contacto" className="px-6 py-3 rounded-2xl bg-[var(--brand)] text-black font-semibold">
//               Agendar consulta
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-[var(--muted)]/60">
//         <div className="max-w-6xl mx-auto px-6 py-8 text-sm opacity-80">
//           {site.footer?.legal?.replace('{{year}}', String(new Date().getFullYear()))}
//         </div>
//       </footer>

//       {/* Sticky CTA en mobile */}
//       {showSticky && (
//         <div className="md:hidden fixed inset-x-0 bottom-4 z-40">
//           <div className="mx-auto max-w-sm px-4">
//             <a href="#contacto" className="block text-center px-6 py-3 rounded-2xl bg-[var(--brand)] text-black font-semibold shadow-xl">
//               Agendar consulta
//             </a>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
