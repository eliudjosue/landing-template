import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin } from 'lucide-react';
import siteData from '@/content/site.json';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">{siteData.site.name}</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {siteData.site.description}
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <Mail className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <Phone className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:text-white transition-colors cursor-pointer">Desarrollo Web</li>
              <li className="hover:text-white transition-colors cursor-pointer">Aplicaciones Móviles</li>
              <li className="hover:text-white transition-colors cursor-pointer">Consultoría Tech</li>
              <li className="hover:text-white transition-colors cursor-pointer">Mantenimiento</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{siteData.site.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{siteData.site.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">España</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />
        
        <div className="text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} {siteData.site.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}