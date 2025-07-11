
const Footer = () => {
  return (
    <footer className="bg-jung-dark border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/b5a1af54-1ab5-4b8f-96ff-19f69b3d8720.png" 
              alt="Jung Logo" 
              className="h-8 w-auto"
            />
            <div>
              <div className="jung-heading text-white text-lg">jung</div>
              <div className="jung-subtitle text-jung-pink text-sm">Voice & Performance</div>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="jung-body text-gray-400 text-sm mb-2">
              Transformando cliques em faturamento desde 2019
            </p>
            <p className="jung-body text-gray-500 text-xs">
              © 2024 Jung Agency. Todos os direitos reservados.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="jung-body text-gray-400 text-sm">
            Pronto para escalar seus resultados? Entre em contato e vamos conversar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
