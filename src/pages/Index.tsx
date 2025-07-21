
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import DetailedServices from "@/components/DetailedServices";
import Benefits from "@/components/Benefits";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import SkipLink from "@/components/SkipLink";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SkipLink />
      <SchemaMarkup />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Services />
        <About />
        <DetailedServices />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
