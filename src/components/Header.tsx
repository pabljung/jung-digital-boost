
import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-jung-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/22971996-9d69-4a47-a695-09cadc9e634f.png" 
            alt="Jung Logo" 
            className="h-8 w-auto"
          />
          <span className="jung-heading text-lg text-jung-dark">jung</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('services')}
            className="jung-menu text-jung-dark hover:text-jung-pink transition-colors"
          >
            Serviços
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="jung-menu text-jung-dark hover:text-jung-pink transition-colors"
          >
            Sobre
          </button>
          <button 
            onClick={() => scrollToSection('benefits')}
            className="jung-menu text-jung-dark hover:text-jung-pink transition-colors"
          >
            Benefícios
          </button>
        </nav>

        <Button 
          className="bg-jung-pink hover:bg-jung-pink/90 text-white jung-body font-semibold px-6 py-2 animate-pulse-glow"
          onClick={() => scrollToSection('cta')}
        >
          Agendar Diagnóstico
        </Button>
      </div>
    </header>
  );
};

export default Header;
