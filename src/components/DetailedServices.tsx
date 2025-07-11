
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Users, TrendingUp, Share2 } from "lucide-react";

const DetailedServices = () => {
  const services = [
    {
      icon: <Megaphone className="w-10 h-10" />,
      title: "Gestão de Tráfego Pago",
      description: "Cuidamos da sua presença nas principais plataformas de mídia paga com estratégia, agilidade e foco total em conversão. Você aparece pro público certo, na hora certa, do jeito certo."
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "Consultoria de Tráfego & Estratégia",
      description: "A gente senta contigo, entende o contexto e traça um plano. Um plano real, prático e personalizado. Sem enrolação, só o que funciona."
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Assessoria Completa de Marketing Digital",
      description: "Não é só tráfego. É posicionamento, vendas, páginas que convertem, automações, criativos que performam e copy que vende. Você cresce, a gente escala junto."
    },
    {
      icon: <Share2 className="w-10 h-10" />,
      title: "Conteúdo e Gestão de Redes Sociais",
      description: "O digital não dorme — e sua marca também não pode. Criamos conteúdo estratégico, autêntico e alinhado com o seu posicionamento. Planejamos, produzimos, publicamos e analisamos. Do post ao Reels, da ideia ao resultado."
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-jung-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Como impulsionamos o{' '}
            <span className="text-jung-pink">seu negócio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Serviços especializados para cada fase do seu crescimento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover-lift group">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="text-jung-pink group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-jung-pink hover:bg-jung-pink/90 text-white font-bold px-8 py-4 text-lg rounded-xl hover-lift animate-pulse-glow group"
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

export default DetailedServices;
