
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-jung-dark border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/8f7eded5-2bc0-4f95-a28b-5de066d830aa.png" 
              alt="Jung Logo" 
              className="h-14 w-auto"
            />
          </div>
          
          <div className="text-center md:text-right">
            <p className="jung-body text-gray-400 text-sm mb-2">
              Transformando cliques em faturamento desde 2019
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="jung-body text-gray-400 text-sm mb-4 md:mb-0">
              Pronto para escalar seus resultados? Entre em contato e vamos conversar.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy-policy" 
                className="jung-body text-gray-400 text-sm hover:text-jung-pink transition-colors duration-200"
              >
                Política de Privacidade
              </Link>
              <span className="text-gray-600">|</span>
              <p className="jung-body text-gray-500 text-xs">
                © 2024 Jung Agency. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
