
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => {
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

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Logo Integration */}
          <div className="mb-8 animate-fade-in">
            <img 
              src="/lovable-uploads/22971996-9d69-4a47-a695-09cadc9e634f.png" 
              alt="Jung Logo" 
              className="h-16 w-auto mx-auto mb-4 opacity-90"
            />
            <p className="text-jung-pink font-medium text-lg tracking-wider uppercase">
              Voice & Performance
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fade-in">
            Transforme cliques em{' '}
            <span className="text-jung-pink relative">
              faturamento
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-jung-pink/60 rounded"></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in">
            Escale resultados com estratégias afiadas, feitas sob medida pro seu negócio.
          </p>

          {/* Value Proposition */}
          <div className="bg-jung-pink/10 border border-jung-pink/20 rounded-2xl p-6 md:p-8 mb-10 max-w-4xl mx-auto animate-scale-in">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-jung-pink mr-2" />
              <span className="text-jung-pink font-semibold">Diagnóstico GRATUITO</span>
            </div>
            <p className="text-white text-lg leading-relaxed">
              Agende agora um Diagnóstico <strong className="text-jung-pink">GRATUITO</strong> e descubra como nossa bagagem de{' '}
              <strong className="text-jung-pink">5 anos</strong> — e mais de{' '}
              <strong className="text-jung-pink">R$ 31 milhões gerados em vendas</strong> — pode destravar novos patamares pra sua marca.
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-scale-in">
            <Button 
              size="lg"
              className="bg-jung-pink hover:bg-jung-pink/90 text-white font-bold px-8 py-4 text-lg rounded-xl hover-lift animate-pulse-glow group"
              onClick={() => scrollToSection('cta')}
            >
              AGENDAR MEU DIAGNÓSTICO GRATUITO
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="text-3xl font-bold text-jung-pink mb-2">5 anos</div>
              <div className="text-gray-400">de experiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-jung-pink mb-2">R$ 31M+</div>
              <div className="text-gray-400">gerados em vendas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-jung-pink mb-2">100%</div>
              <div className="text-gray-400">foco em resultado</div>
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
    </section>
  );
};

export default Hero;
