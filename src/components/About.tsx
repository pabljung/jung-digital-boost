
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section id="about" className="py-20 bg-white" role="region" aria-labelledby="about-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Brand */}
          <div className="mb-12">
            <img 
              src="/lovable-uploads/1ae7234c-1096-47c8-bf1f-10b07718962e.png" 
              alt="Jung Voice & Performance - Logo da agência de performance marketing" 
              className="h-24 w-auto mx-auto mb-6"
              loading="lazy"
              width="200"
              height="96"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <h2 id="about-heading" className="text-4xl md:text-6xl font-black text-jung-dark">
              Prazer, somos a{' '}
              <span className="text-jung-pink">Jung</span>
            </h2>

            <div className="text-lg md:text-xl text-gray-700 space-y-6 leading-relaxed max-w-3xl mx-auto">
              <p className="font-semibold text-jung-dark">
                A gente não brinca de mídia paga.
              </p>
              
              <p>
                Somos uma agência de performance com mindset estratégico e execução de alto nível.
                Não vendemos promessas: entregamos direção, clareza e resultado.
              </p>

              <p>
                Nosso trabalho é combinar criatividade com dados. Personalização com profundidade.
                Planejamento com ousadia.
              </p>

              <p className="text-2xl font-bold text-jung-pink">
                O que você investe aqui, volta. Com lucro.
              </p>
            </div>
          </div>

          {/* Visual Elements */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 text-left">
              <h3 className="text-2xl font-bold text-jung-dark mb-4">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Transformar investimento em mídia paga em crescimento real e sustentável para negócios que pensam grande.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 text-left">
              <h3 className="text-2xl font-bold text-jung-dark mb-4">Nossa Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser a referência em performance marketing, onde estratégia e execução se encontram para gerar resultados excepcionais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
