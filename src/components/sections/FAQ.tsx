import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import siteData from '@/content/site.json';

export function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Resuelve las dudas más comunes sobre nuestros servicios y procesos.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {siteData.faq.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-slate-200 rounded-lg px-6 hover:border-blue-300 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-blue-600 py-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}