
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, BookOpen, Search, BarChart3, MessageCircle, Activity, Wrench, FileText, Trophy } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const Benefits = () => {
  const { elementRef, isIntersecting } = useIntersectionObserver();
  
  const benefits = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Estratégia sob medida",
      description: "Nada de fórmula pronta. Cada ação é pensada pra sua realidade."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Treinamento de criativos que convertem",
      description: "Vamos te mostrar o que funciona — e por que funciona. Sim, você também aprende com a gente."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Diagnóstico de presença digital",
      description: "Análise completa dos seus canais. A gente mostra onde tá travado e onde dá pra acelerar."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Direcionamento contínuo com base em dados",
      description: "Nada de achismo. Aqui, cada passo tem motivo."
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Suporte real-time",
      description: "Dúvida? Ideia? Dificuldade? Time da Jung no WhatsApp com você."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Métricas e análises",
      description: "Números que fazem sentido. Insights que viram ação."
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Otimizações em tempo real",
      description: "Ajuste fino, melhoria contínua. Performance não se faz uma vez só."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Relatórios e dashboards claros",
      description: "Você entende o que tá rolando — sem precisar virar analista de dados."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "E o principal: resultado",
      description: "A gente mede, ajusta, melhora. Mas o que a gente mais gosta mesmo... é de bater meta."
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={elementRef} id="benefits" className="py-20 bg-gray-50" role="region" aria-labelledby="benefits-heading">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all-smooth ${isIntersecting ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
          <h2 id="benefits-heading" className="text-4xl md:text-5xl font-black text-jung-dark mb-6">
            O que você leva nessa{' '}
            <span className="text-jung-pink">jornada</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Muito mais que uma parceria, uma transformação completa do seu negócio digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className={`hover-lift border-0 shadow-lg bg-white group hover-scale transition-all-smooth ${
                isIntersecting ? 'animate-fade-in-up opacity-100' : 'opacity-0'
              }`}
              style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 text-jung-pink group-hover:text-jung-dark transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-jung-dark mb-4 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`text-center bg-jung-dark rounded-2xl p-8 md:p-12 hover-scale transition-all-smooth ${isIntersecting ? 'animate-scale-in animate-delay-500 opacity-100' : 'opacity-0'}`}>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Resultado é o que mais importa
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A gente mede, ajusta, melhora. Mas o que a gente mais gosta mesmo... é de{' '}
            <span className="text-jung-pink font-bold">bater meta</span>.
          </p>
          <Button 
            size="lg"
            className="bg-jung-pink hover:bg-jung-pink/90 text-white font-bold px-8 py-4 text-lg rounded-xl hover-lift animate-pulse-glow group transition-all-smooth"
            onClick={() => scrollToSection('cta')}
          >
            QUERO ESCALAR MEUS RESULTADOS
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
