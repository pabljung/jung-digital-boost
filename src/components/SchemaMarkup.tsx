import { useEffect } from 'react';

const SchemaMarkup = () => {
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Jung Voice & Performance",
      "alternateName": "Jung Agency",
      "url": "https://jungagency.com.br",
      "logo": "https://jungagency.com.br/lovable-uploads/2fcbc0c6-19c2-4bb6-81e1-a7c0dc2f3fbf.png",
      "description": "Agência de performance marketing com 5 anos de experiência e R$ 31M+ gerados. Transforme cliques em faturamento com estratégias sob medida.",
      "foundingDate": "2019",
      "sameAs": [
        "https://www.instagram.com/jung.agency",
        "https://www.linkedin.com/company/jung-agency"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "areaServed": "BR",
        "availableLanguage": "Portuguese"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "BR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "50"
      }
    };

    // Service Schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Performance Marketing",
      "description": "Serviços de performance marketing, mídia paga, Google Ads, Facebook Ads e otimização de campanhas digitais.",
      "provider": {
        "@type": "Organization",
        "name": "Jung Voice & Performance"
      },
      "areaServed": "BR",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Serviços de Marketing Digital",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Google Ads"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Facebook Ads"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Performance Marketing"
            }
          }
        ]
      }
    };

    // FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "O que é performance marketing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Performance marketing é uma estratégia de marketing digital focada em resultados mensuráveis, onde você paga apenas por ações específicas como cliques, conversões ou vendas."
          }
        },
        {
          "@type": "Question",
          "name": "Como funciona o diagnóstico gratuito?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nosso diagnóstico gratuito é uma análise completa da sua presença digital, identificando oportunidades de melhoria e estratégias para aumentar seus resultados."
          }
        }
      ]
    };

    // Insert schemas into head
    const organizationScript = document.createElement('script');
    organizationScript.type = 'application/ld+json';
    organizationScript.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(organizationScript);

    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.textContent = JSON.stringify(serviceSchema);
    document.head.appendChild(serviceScript);

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    // Cleanup function
    return () => {
      document.head.removeChild(organizationScript);
      document.head.removeChild(serviceScript);
      document.head.removeChild(faqScript);
    };
  }, []);

  return null;
};

export default SchemaMarkup;