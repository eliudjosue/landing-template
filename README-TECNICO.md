# Landing Page Template - Documentación Técnica

## 📋 Descripción

Template reutilizable de landing page desarrollado con Next.js 13 (App Router), TypeScript, TailwindCSS y shadcn/ui. Incluye formulario de contacto con validación, panel de administración y sistema completo de SEO y analytics.

## 🚀 Instalación Rápida

```bash
# Clonar el repositorio
git clone <repository-url>
cd nextjs-landing-template

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Ejecutar en modo desarrollo
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
NEXT_PUBLIC_SITE_URL=https://tusitio.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX    # Opcional: Google Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX                # Opcional: Google Tag Manager
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=tusitio.com      # Opcional: Plausible Analytics
ADMIN_USER=admin                               # Usuario del panel admin
ADMIN_PASSWORD=tu_password_seguro              # Contraseña del panel admin
N8N_WEBHOOK_URL=https://tu-n8n.com/webhook    # Opcional: Webhook para notificaciones
RATE_LIMIT_WINDOW=60                          # Ventana de rate limiting (segundos)
RATE_LIMIT_MAX=20                             # Máximo requests por ventana
```

### Personalización de Contenido

Edita `src/content/site.json` con la información de tu cliente:

```json
{
  "site": {
    "name": "Nombre de la Empresa",
    "tagline": "Tu tagline aquí",
    "description": "Descripción de la empresa...",
    "url": "https://ejemplo.com",
    "email": "contacto@ejemplo.com",
    "phone": "+34 900 000 000"
  },
  "hero": {
    "headline": "Tu headline principal",
    "subheadline": "Subtítulo explicativo..."
  }
  // ... resto de secciones
}
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/          # Rutas públicas
│   │   └── page.tsx       # Landing page principal
│   ├── admin/             # Panel de administración
│   │   └── page.tsx       # Dashboard de leads
│   ├── api/
│   │   ├── leads/         # Endpoint para recibir leads
│   │   └── admin/         # APIs protegidas para admin
│   ├── layout.tsx         # Layout principal
│   ├── robots.ts          # Configuración SEO
│   └── sitemap.ts         # Sitemap automático
├── components/
│   ├── sections/          # Secciones de la landing
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTA.tsx
│   │   ├── FAQ.tsx
│   │   ├── ContactForm.tsx
│   │   └── Footer.tsx
│   └── ui/               # Componentes shadcn/ui
├── lib/
│   ├── seo.ts            # Utilidades SEO y metadata
│   ├── analytics.ts      # Tracking de eventos
│   ├── rate-limit.ts     # Rate limiting simple
│   ├── auth.ts           # Basic Auth para admin
│   └── leads-storage.ts  # Almacenamiento local de leads
├── content/
│   └── site.json         # Contenido estático editable
└── types/
    └── lead.ts           # Tipos TypeScript
```

## 🔐 Panel de Administración

Accede a `/admin` con las credenciales configuradas en las variables de entorno.

Funcionalidades:
- Visualización de todos los leads recibidos
- Estadísticas básicas (total, mes actual, semana)
- Exportación de leads a CSV
- Protección con Basic Auth

## 📊 Analytics y Tracking

El sistema soporta múltiples plataformas de analytics:

- **Google Analytics 4**: Configura `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Google Tag Manager**: Configura `NEXT_PUBLIC_GTM_ID`
- **Plausible**: Configura `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

Los eventos se trackean automáticamente:
- Envío de formularios de contacto
- Navegación entre secciones

## 🛡️ Seguridad Implementada

- **Rate Limiting**: Protección contra spam (configurable)
- **Honeypot**: Campo oculto para detectar bots
- **Validación**: Zod para validación de datos del servidor
- **Basic Auth**: Protección del panel admin
- **Sanitización**: Escape automático de datos en CSV

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Deploy automático con cada push

### Cloud Run (Google Cloud)

```bash
# Build para producción
npm run build

# Crear Dockerfile si es necesario
# Configurar variables de entorno
# Deploy a Cloud Run
```

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch
```

Los tests incluyen validación de:
- Esquemas Zod
- Endpoint de leads
- Detección de honeypot
- Manejo de errores

## 🔄 Flujo de Leads

1. **Usuario completa formulario** → Validación client-side
2. **Envío a /api/leads** → Rate limiting + Validación servidor
3. **Almacenamiento local** → JSON file en carpeta `data/`
4. **Webhook opcional** → Notificación a n8n/Zapier
5. **Panel admin** → Visualización y exportación

## 🎨 Personalización de Diseño

### Colores
Modifica variables CSS en `app/globals.css`:

```css
:root {
  --primary: 220 90% 55%;    /* Azul principal */
  --secondary: 220 60% 95%;  /* Azul claro */
  /* ... más variables */
}
```

### Tipografía
Cambia la fuente en `app/layout.tsx`:

```tsx
import { Inter, Montserrat } from 'next/font/google';
const font = Montserrat({ subsets: ['latin'] });
```

### Componentes
Todos los componentes están en `src/components/sections/` y pueden editarse individualmente.

## 📝 Checklist de Configuración por Cliente

- [ ] Editar `src/content/site.json` con información del cliente
- [ ] Configurar variables de entorno (`.env.local`)
- [ ] Personalizar colores y tipografía si es necesario
- [ ] Añadir logo del cliente (reemplazar referencias en código)
- [ ] Configurar analytics (GA4, GTM, Plausible)
- [ ] Establecer webhook para notificaciones (opcional)
- [ ] Probar formulario de contacto
- [ ] Verificar panel admin
- [ ] Deploy y configurar dominio

## 🆘 Troubleshooting

### Los leads no se guardan
- Verificar permisos de escritura en carpeta `data/`
- Revisar logs del servidor en `/api/leads`

### Panel admin no accesible
- Verificar `ADMIN_USER` y `ADMIN_PASSWORD` en variables de entorno
- Confirmar que las credenciales están en Base64

### Analytics no funciona
- Verificar que las variables de entorno están configuradas
- Confirmar que los scripts se cargan en el navegador
- Revisar consola del navegador para errores

## 📞 Soporte

Para dudas técnicas o problemas con el template, revisa:
1. Esta documentación
2. Logs del servidor (`npm run dev`)
3. Consola del navegador
4. Variables de entorno configuradas correctamente

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025