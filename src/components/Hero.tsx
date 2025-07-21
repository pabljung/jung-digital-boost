
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { ScheduleModal } from "./ScheduleModal";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-jung-dark via-gray-900 to-jung-dark overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0080' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-jung-pink rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-jung-pink/60 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-jung-pink/80 rounded-full animate-float" style={{animationDelay: '2s'}}></div>

      <div ref={elementRef} className="container mx-auto px-4 py-12 md:py-20 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Logo Integration */}
          <div className={`mb-6 md:mb-8 transition-all-smooth ${isIntersecting ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
            <img 
              src="/lovable-uploads/8b5b2e3d-e16d-49c8-9ae3-4cc297ad8bb2.png" 
              alt="Jung - Agência de Performance Marketing e Mídia Paga" 
              className="h-16 md:h-20 w-auto mx-auto opacity-90"
              loading="eager"
              width="200"
              height="80"
            />
          </div>

          {/* Main Headline */}
          <h1 className={`text-3xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight px-2 transition-all-smooth ${isIntersecting ? 'animate-fade-in-up animate-delay-100 opacity-100' : 'opacity-0'}`}>
            Transforme cliques em{' '}
            <span className="text-jung-pink relative" aria-label="faturamento, palavra destacada">
              faturamento
              <div className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-jung-pink/60 rounded" aria-hidden="true"></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed px-4 transition-all-smooth ${isIntersecting ? 'animate-fade-in-up animate-delay-200 opacity-100' : 'opacity-0'}`}>
            Escale resultados com estratégias afiadas, feitas sob medida pro seu negócio.
          </p>

          {/* Value Proposition */}
          <div className={`bg-jung-pink/10 border border-jung-pink/20 rounded-2xl p-4 md:p-6 lg:p-8 mb-8 md:mb-10 max-w-4xl mx-auto transition-all-smooth hover-scale ${isIntersecting ? 'animate-scale-in animate-delay-300 opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-jung-pink mr-2" />
              <span className="text-jung-pink font-semibold text-sm md:text-base">Diagnóstico GRATUITO</span>
            </div>
            <p className="text-white text-sm md:text-lg leading-relaxed px-2">
              Agende agora um Diagnóstico <strong className="text-jung-pink">GRATUITO</strong> e descubra como nossa bagagem de{' '}
              <strong className="text-jung-pink">5 anos</strong> — e mais de{' '}
              <strong className="text-jung-pink">R$ 31 milhões gerados em vendas</strong> — pode destravar novos patamares pra sua marca.
            </p>
          </div>

          {/* CTA Button */}
          <div className={`mb-8 md:mb-0 transition-all-smooth ${isIntersecting ? 'animate-scale-in animate-delay-400 opacity-100' : 'opacity-0'}`}>
            <Button 
              size="lg"
              className="bg-jung-pink hover:bg-jung-pink/90 text-white font-bold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl hover-lift animate-pulse-glow group w-full sm:w-auto focus:ring-4 focus:ring-jung-pink/50 transition-all-smooth"
              onClick={() => setIsModalOpen(true)}
              aria-label="Agendar diagnóstico gratuito de marketing digital"
            >
              <span className="hidden sm:inline">AGENDAR MEU DIAGNÓSTICO GRATUITO</span>
              <span className="sm:hidden">AGENDAR DIAGNÓSTICO</span>
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 px-4 transition-all-smooth ${isIntersecting ? 'animate-fade-in-up animate-delay-500 opacity-100' : 'opacity-0'}`}>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-jung-pink mb-2">5 anos</div>
              <div className="text-gray-400 text-sm md:text-base">de experiência</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-jung-pink mb-2">R$ 31M+</div>
              <div className="text-gray-400 text-sm md:text-base">gerados em vendas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-jung-pink mb-2">100%</div>
              <div className="text-gray-400 text-sm md:text-base">foco em resultado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-jung-pink rounded-full flex justify-center">
          <div className="w-1 h-3 bg-jung-pink rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <ScheduleModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </section>
  );
};

export default Hero;
