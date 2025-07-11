
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Target, Users, TrendingUp, BarChart3, Eye, Zap, UserPlus, DollarSign, Clock } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Aumentar o reconhecimento da sua marca",
      description: "Tornamos sua marca visível, desejada e presente na cabeça (e no feed) do público."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Gerar leads qualificados",
      description: "Criamos campanhas com mira afiada: só atrai quem realmente quer o que você vende."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Otimizar o ROI dos anúncios",
      description: "Sem achismos: aqui, cada real investido é pensado pra voltar multiplicado."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Escalar com consistência",
      description: "Construímos estrutura pra você crescer com segurança — e com resultado real."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Conhecer melhor seu público",
      description: "Extraímos dados e transformamos em insights. Pra você falar com quem importa."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Converter mais",
      description: "Projetamos funis de venda com foco em ação: visitantes viram clientes."
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Ganhar seguidores que fazem sentido",
      description: "Crescimento de audiência com qualidade e intenção."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Saber exatamente onde seu dinheiro tá indo",
      description: "Transparência total. Você entende o que acontece — e por quê acontece."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Economizar tempo e energia",
      description: "Você foca no seu negócio. A gente cuida da estratégia, execução e performance."
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-jung-dark mb-6">
            O que fazemos pelo seu negócio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cada estratégia é pensada para entregar resultado real e escalável
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="hover-lift border-0 shadow-lg bg-white group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 text-jung-pink group-hover:text-jung-dark transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-jung-dark mb-4 leading-tight">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-jung-dark rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto pra transformar tráfego em{' '}
            <span className="text-jung-pink">resultado de verdade?</span>
          </h3>
          <button 
            className="bg-jung-pink hover:bg-jung-pink/90 text-white font-bold px-8 py-4 text-lg rounded-xl hover-lift animate-pulse-glow group inline-flex items-center"
            onClick={() => scrollToSection('cta')}
          >
            AGENDAR MEU DIAGNÓSTICO GRATUITO
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
