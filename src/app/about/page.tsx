'use client';

import React from 'react';
import { 
  faLightbulb,
  faAward,
  faHandshake,
  faHeart,
  faRocket,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import HeroSection from '@/components/about/HeroSection';
import HistorySection from '@/components/about/HistorySection';
import ValuesSection from '@/components/about/ValuesSection';
import MissionVisionSection from '@/components/about/MissionVisionSection';
import FounderSection from '@/components/about/FounderSection';
import CTASection from '@/components/about/CTASection';

const AboutPage = () => {
  const valores = [
    {
      icon: faLightbulb,
      title: "Creatividad",
      description: "Transformamos ideas en diseños únicos que destacan y representan la personalidad de cada cliente."
    },
    {
      icon: faAward,
      title: "Calidad Premium",
      description: "Cada prenda se produce con los mejores materiales y la máxima atención al detalle."
    },
    {
      icon: faHandshake,
      title: "Compromiso",
      description: "Trabajamos incansablemente para superar expectativas y construir relaciones de confianza duraderas."
    },
    {
      icon: faHeart,
      title: "Pasión",
      description: "Cada diseño está hecho con amor y dedicación, reflejando nuestra pasión por la moda personalizada."
    },
    {
      icon: faRocket,
      title: "Innovación",
      description: "Constantemente exploramos nuevas técnicas y tendencias para ofrecer productos únicos."
    },
    {
      icon: faShieldAlt,
      title: "Confianza",
      description: "Construimos relaciones sólidas basadas en transparencia, honestidad y cumplimiento de promesas."
    }
  ];

  const estadisticas = [
    { numero: "500+", texto: "Clientes Satisfechos" },
    { numero: "1000+", texto: "Prendas Personalizadas" },
    { numero: "50+", texto: "Diseños Únicos" },
    { numero: "100%", texto: "Satisfacción Garantizada" }
  ];

  return (
    <main className="bg-white min-h-screen pt-20">
      <HeroSection estadisticas={estadisticas} />
      <HistorySection />
      <ValuesSection valores={valores} />
      <MissionVisionSection />
      <FounderSection />
      <CTASection />
    </main>
  );
};

export default AboutPage;
