
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
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/a1dd3ecd-5727-4856-b0fd-81d29ffbb634.png" 
            alt="Jung Logo" 
            className="h-12 w-auto"
          />
          <div className="flex flex-col">
            <div className="jung-subtitle text-xs text-jung-pink leading-tight">Voice & Performance</div>
          </div>
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
