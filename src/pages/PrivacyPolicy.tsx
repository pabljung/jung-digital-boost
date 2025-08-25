import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Users, Lock, Cookie, FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao site
            </Button>
            <div>
              <h1 className="text-xl font-bold text-jung-dark">Política de Privacidade</h1>
              <p className="text-sm text-muted-foreground">Jung Voice & Performance</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="mb-8 p-6 bg-jung-pink/5 rounded-lg border border-jung-pink/20">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark m-0">Compromisso com sua Privacidade</h2>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>
            <p className="text-gray-700">
              A Jung Voice & Performance está comprometida em proteger sua privacidade e dados pessoais, 
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). 
              Esta política explica como coletamos, usamos, compartilhamos e protegemos suas informações.
            </p>
          </div>

          {/* 1. Coleta de Informações */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">1. Coleta de Informações</h2>
            </div>
            
            <h3 className="text-lg font-medium text-jung-dark mb-3">1.1 Dados Coletados</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-jung-dark mb-2">Informações Pessoais:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Nome completo</li>
                  <li>• E-mail</li>
                  <li>• Telefone</li>
                  <li>• Informações fornecidas em formulários de contato</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-jung-dark mb-2">Dados Técnicos:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Endereço IP</li>
                  <li>• Tipo de navegador</li>
                  <li>• Sistema operacional</li>
                  <li>• Páginas visitadas e tempo de navegação</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-medium text-jung-dark mb-3">1.2 Finalidades da Coleta</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Prestação de serviços:</strong> Responder solicitações e fornecer informações sobre nossos cursos</li>
              <li>• <strong>Comunicação:</strong> Enviar newsletters, atualizações e conteúdo relevante</li>
              <li>• <strong>Melhoria do site:</strong> Analisar o uso para otimizar a experiência do usuário</li>
              <li>• <strong>Cumprimento legal:</strong> Atender obrigações legais e regulamentares</li>
            </ul>
          </section>

          {/* 2. Uso das Informações */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">2. Uso das Informações</h2>
            </div>
            
            <p className="text-gray-700 mb-4">
              Utilizamos suas informações pessoais exclusivamente para as finalidades descritas nesta política:
            </p>

            <div className="space-y-4">
              <div className="p-4 border-l-4 border-jung-pink bg-jung-pink/5">
                <h4 className="font-medium text-jung-dark mb-2">Prestação de Serviços</h4>
                <p className="text-sm text-gray-700">
                  Processamos seus dados para responder a consultas, agendar aulas e fornecer 
                  informações sobre nossos cursos de voice coaching e performance.
                </p>
              </div>
              <div className="p-4 border-l-4 border-jung-pink bg-jung-pink/5">
                <h4 className="font-medium text-jung-dark mb-2">Marketing e Comunicação</h4>
                <p className="text-sm text-gray-700">
                  Com seu consentimento, enviamos conteúdo educativo, dicas de performance vocal 
                  e informações sobre novos cursos e workshops.
                </p>
              </div>
              <div className="p-4 border-l-4 border-jung-pink bg-jung-pink/5">
                <h4 className="font-medium text-jung-dark mb-2">Análise e Melhoria</h4>
                <p className="text-sm text-gray-700">
                  Analisamos dados agregados e anonimizados para entender como melhorar 
                  nossos serviços e a experiência em nosso site.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Compartilhamento de Dados */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">3. Compartilhamento de Dados</h2>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-medium">
                🔒 A Jung Voice & Performance NÃO vende, aluga ou compartilha seus dados pessoais com terceiros para fins comerciais.
              </p>
            </div>

            <h3 className="text-lg font-medium text-jung-dark mb-3">Compartilhamos dados apenas quando:</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Consentimento explícito:</strong> Quando você nos autoriza expressamente</li>
              <li>• <strong>Prestadores de serviço:</strong> Com parceiros que nos auxiliam na operação (ex: plataformas de e-mail), sob contratos de confidencialidade</li>
              <li>• <strong>Obrigação legal:</strong> Quando exigido por lei ou autoridades competentes</li>
              <li>• <strong>Proteção de direitos:</strong> Para proteger nossos direitos legais ou prevenir fraudes</li>
            </ul>
          </section>

          {/* 4. Direitos dos Usuários */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">4. Seus Direitos (LGPD)</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Conforme a LGPD, você possui os seguintes direitos sobre seus dados pessoais:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Confirmação e Acesso</h4>
                  <p className="text-sm text-blue-800">Saber se processamos seus dados e acessá-los</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Correção</h4>
                  <p className="text-sm text-blue-800">Corrigir dados incompletos ou inexatos</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Eliminação</h4>
                  <p className="text-sm text-blue-800">Solicitar a exclusão de dados desnecessários</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Portabilidade</h4>
                  <p className="text-sm text-blue-800">Receber seus dados em formato estruturado</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Anonimização</h4>
                  <p className="text-sm text-blue-800">Bloqueio ou anonimização dos dados</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Oposição</h4>
                  <p className="text-sm text-blue-800">Opor-se ao tratamento com base legítima</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Revogação</h4>
                  <p className="text-sm text-blue-800">Retirar consentimento a qualquer momento</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Informação</h4>
                  <p className="text-sm text-blue-800">Conhecer entidades com quem compartilhamos</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                <strong>Como exercer seus direitos:</strong> Entre em contato conosco através do e-mail 
                <a href="mailto:privacidade@jungcria.com" className="text-jung-pink hover:underline ml-1">
                  privacidade@jungcria.com
                </a> ou pelos canais de contato disponíveis em nosso site.
              </p>
            </div>
          </section>

          {/* 5. Segurança das Informações */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">5. Segurança das Informações</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-jung-pink/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-jung-pink" />
                </div>
                <h4 className="font-medium text-jung-dark mb-2">Criptografia</h4>
                <p className="text-sm text-gray-700">Dados transmitidos com SSL/TLS</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-jung-pink/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-jung-pink" />
                </div>
                <h4 className="font-medium text-jung-dark mb-2">Acesso Controlado</h4>
                <p className="text-sm text-gray-700">Apenas pessoal autorizado</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-jung-pink/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-jung-pink" />
                </div>
                <h4 className="font-medium text-jung-dark mb-2">Backups Seguros</h4>
                <p className="text-sm text-gray-700">Cópias protegidas e criptografadas</p>
              </div>
            </div>
          </section>

          {/* 6. Cookies e Tecnologias */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">6. Cookies e Tecnologias de Rastreamento</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência:
            </p>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-jung-dark mb-2">Cookies Essenciais</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Necessários para o funcionamento básico do site (sempre ativos).
                </p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Sempre Ativo</span>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-jung-dark mb-2">Cookies de Performance</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Coletam informações sobre como você usa o site para melhorarmos a experiência.
                </p>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Opcional</span>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-jung-dark mb-2">Cookies de Marketing</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Usados para personalizar anúncios e medir a eficácia de campanhas.
                </p>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Opcional</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
            </p>
          </section>

          {/* 7. Retenção de Dados */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">7. Retenção de Dados</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas:
            </p>

            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Dados de contato:</strong> Até a retirada do consentimento ou 2 anos após o último contato</li>
              <li>• <strong>Dados de navegação:</strong> 12 meses para análise de performance</li>
              <li>• <strong>Dados legais:</strong> Conforme exigido pela legislação aplicável</li>
              <li>• <strong>Dados de marketing:</strong> Até a revogação do consentimento</li>
            </ul>
          </section>

          {/* 8. Alterações na Política */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">8. Alterações nesta Política</h2>
            </div>

            <p className="text-gray-700 mb-4">
              Esta Política de Privacidade pode ser atualizada periodicamente. Quando isso ocorrer:
            </p>

            <ul className="text-gray-700 space-y-2">
              <li>• Publicaremos a versão atualizada nesta página</li>
              <li>• Atualizaremos a data da "Última atualização"</li>
              <li>• Para mudanças significativas, notificaremos por e-mail ou aviso no site</li>
              <li>• Recomendamos que revise esta política periodicamente</li>
            </ul>
          </section>

          {/* 9. Contato */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-jung-pink" />
              <h2 className="text-xl font-semibold text-jung-dark">9. Contato e Dúvidas</h2>
            </div>

            <div className="bg-jung-pink/5 border border-jung-pink/20 p-6 rounded-lg">
              <h3 className="font-medium text-jung-dark mb-4">Entre em contato conosco:</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-jung-dark mb-2">Dúvidas sobre Privacidade:</h4>
                  <p className="text-sm text-gray-700">
                    E-mail: <a href="mailto:privacidade@jungcria.com" className="text-jung-pink hover:underline">privacidade@jungcria.com</a>
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-jung-dark mb-2">Contato Geral:</h4>
                  <p className="text-sm text-gray-700">
                    E-mail: <a href="mailto:contato@jungcria.com" className="text-jung-pink hover:underline">contato@jungcria.com</a>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-jung-pink/20">
                <h4 className="font-medium text-jung-dark mb-2">Autoridade Nacional de Proteção de Dados (ANPD):</h4>
                <p className="text-sm text-gray-700">
                  Caso não esteja satisfeito com nossa resposta, você pode contatar a ANPD através do site: 
                  <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-jung-pink hover:underline ml-1">
                    gov.br/anpd
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <p className="text-center text-sm text-gray-600">
              Esta Política de Privacidade é válida a partir de {new Date().toLocaleDateString('pt-BR')} e se aplica 
              a todos os usuários do site Jung Voice & Performance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;