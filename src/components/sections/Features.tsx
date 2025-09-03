import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Code2, Shield } from 'lucide-react';
import siteData from '@/content/site.json';

const iconMap = {
  Zap,
  Code2,
  Shield,
};

export function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Combinamos experiencia técnica con un enfoque centrado en el cliente para 
            entregar soluciones que realmente impulsan tu negocio.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {siteData.features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
              >
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
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