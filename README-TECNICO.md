# Landing Page Editable - Documentación Técnica

## Inicio Rápido

### 1. Instalación
```bash
npm install
```

### 2. Configuración
Crea un archivo `.env.local` basado en `.env.example`:
```bash
cp .env.example .env.local
```

Edita las variables según tu configuración:
- `NEXT_PUBLIC_SITE_URL`: URL de tu sitio
- `ADMIN_USER` y `ADMIN_PASSWORD`: Credenciales para el panel admin
- Analytics opcionales: GA4, GTM, Plausible

### 3. Desarrollo
```bash
npm run dev
```

El sitio estará disponible en http://localhost:3000

## Estructura del Proyecto

### Archivos de Contenido
- `src/content/site.json`: Todo el contenido del sitio
- `src/content/theme.json`: Colores, fuentes y estilos

### Componentes Principales
- `src/components/sections/`: Secciones modulares (Hero, Features, etc.)
- `src/lib/content.ts`: Validación y carga de contenido con Zod
- `src/lib/theme.tsx`: Sistema de theming dinámico

### APIs
- `/api/leads`: Manejo de formularios con validación y rate limiting
- `/api/admin/*`: Panel administrativo protegido

## Personalización

### Editar Contenido
Modifica `src/content/site.json` para cambiar:
- Textos de todas las secciones
- Enlaces y CTAs
- Habilitar/deshabilitar secciones con `enabled: false`

### Cambiar Diseño
Edita `src/content/theme.json` para personalizar:
- Colores de marca
- Radios de bordes
- Fuentes

### Agregar Secciones
1. Crear componente en `src/components/sections/`
2. Agregar tipos en `src/types/content.d.ts`
3. Actualizar schema en `src/lib/content.ts`
4. Incluir en `src/app/page.tsx`

## Panel Admin

Accede a `/admin` con las credenciales configuradas en `.env.local` para:
- Ver todos los leads recibidos
- Filtrar y buscar contactos
- Exportar datos en CSV

## Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otros Providers
- Configurar build command: `npm run build`
- Output directory: `out/`
- Asegúrate de configurar las variables de entorno

## Variables de Entorno

### Requeridas
- `ADMIN_USER`: Usuario para panel admin
- `ADMIN_PASSWORD`: Contraseña para panel admin

### Opcionales
- `NEXT_PUBLIC_SITE_URL`: URL del sitio (para SEO)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics 4
- `NEXT_PUBLIC_GTM_ID`: Google Tag Manager
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Plausible Analytics
- `N8N_WEBHOOK_URL`: Webhook para integraciones
- `RATE_LIMIT_WINDOW`: Ventana de rate limiting en segundos (default: 60)
- `RATE_LIMIT_MAX`: Máximo requests por ventana (default: 20)

## Funcionalidades

### Sistema de Theming
- CSS Variables dinámicas desde JSON
- Cambios en tiempo real sin rebuild
- Soporte para modo oscuro

### Formulario de Contacto
- Validación con Zod
- Protección honeypot anti-spam
- Rate limiting por IP
- Almacenamiento local de leads
- Webhook opcional para integraciones

### SEO
- Meta tags dinámicos
- Open Graph y Twitter Cards
- JSON-LD structured data
- Robots.txt y sitemap automáticos

### Analytics
- Soporte múltiple: GA4, GTM, Plausible
- Event tracking incluido
- Configuración por variables de entorno

## Testing

```bash
# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage
```

## Troubleshooting

### Error: No se pueden cargar los leads
- Verifica que el directorio `.data/` tenga permisos de escritura
- En producción, considera usar una base de datos externa

### Error: Admin no funciona
- Verifica que `ADMIN_USER` y `ADMIN_PASSWORD` estén configurados
- Asegúrate de usar HTTPS en producción para Basic Auth

### Error: Formulario no envía
- Revisa la consola del navegador para errores de validación
- Verifica que la API `/api/leads` esté respondiendo

## Próximos Pasos

1. **Base de Datos**: Reemplazar almacenamiento local con PostgreSQL/Supabase
2. **CMS**: Integrar con Sanity o Contentful para edición visual
3. **A/B Testing**: Implementar variantes de contenido
4. **Email**: Agregar notificaciones automáticas por email

## Soporte

Para dudas técnicas:
1. Revisa la consola del navegador
2. Verifica los logs del servidor
3. Confirma configuración de variables de entorno