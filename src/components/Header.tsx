
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScheduleModal } from "./ScheduleModal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-jung-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/2fcbc0c6-19c2-4bb6-81e1-a7c0dc2f3fbf.png" 
            alt="Jung Voice & Performance - Agência de Performance Marketing" 
            className="h-20 w-auto"
            loading="eager"
            width="200"
            height="80"
          />
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8">
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
          className="bg-jung-pink hover:bg-jung-pink/90 text-white jung-body font-semibold px-4 py-2 text-sm lg:px-6 lg:text-base animate-pulse-glow focus:ring-4 focus:ring-jung-pink/50"
          onClick={() => setIsModalOpen(true)}
          aria-label="Abrir modal para agendar diagnóstico gratuito"
        >
          <span className="hidden sm:inline">Agendar Diagnóstico</span>
          <span className="sm:hidden">Agendar</span>
        </Button>
      </div>
      
      <ScheduleModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </header>
  );
};

export default Header;
