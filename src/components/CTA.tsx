
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, Calendar, Zap } from "lucide-react";
import { ScheduleModal } from "./ScheduleModal";

const CTA = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section id="cta" className="py-20 bg-jung-dark" role="region" aria-labelledby="cta-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <img 
                src="/lovable-uploads/b5a1af54-1ab5-4b8f-96ff-19f69b3d8720.png" 
                alt="Jung - Logo rosa da agência de performance marketing" 
                className="h-20 w-auto mx-auto mb-4"
                loading="lazy"
                width="200"
                height="80"
              />
            </div>
            
            <h2 id="cta-heading" className="text-4xl md:text-6xl font-black text-white mb-6">
              Pronto pra{' '}
              <span className="text-jung-pink">transformar</span>{' '}
              seu negócio?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Agende seu diagnóstico gratuito agora e descubra como nossa experiência de 5 anos pode 
              acelerar seus resultados digitais
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-jung-pink mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">Diagnóstico Gratuito</h3>
                <p className="text-gray-300 text-sm">Análise completa sem custo</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-jung-pink mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">5 Anos de Experiência</h3>
                <p className="text-gray-300 text-sm">Expertise comprovada no mercado</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-jung-pink mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">R$ 31M+ Gerados</h3>
                <p className="text-gray-300 text-sm">Em vendas para nossos clientes</p>
              </CardContent>
            </Card>
          </div>

          {/* Main CTA Button */}
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-jung-pink hover:bg-jung-pink/90 text-white font-black px-12 py-6 text-xl rounded-2xl hover-lift animate-pulse-glow group text-center focus:ring-4 focus:ring-jung-pink/50"
              onClick={() => setIsModalOpen(true)}
              aria-label="Agendar diagnóstico gratuito de performance marketing"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <Calendar className="mr-3 w-6 h-6" aria-hidden="true" />
                  AGENDAR DIAGNÓSTICO GRATUITO
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
                <div className="text-sm font-normal opacity-90">
                  Sem compromisso • Resultado garantido
                </div>
              </div>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Diagnóstico 100% gratuito • Sem pegadinhas • Foco total em resultado
            </p>
          </div>
        </div>
      </div>
      
      <ScheduleModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </section>
  );
};

export default CTA;
