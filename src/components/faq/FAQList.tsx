"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { 
  faShirt, 
  faTruck, 
  faPalette, 
  faShieldAlt,
  faMapMarkerAlt,
  faSprayCan
} from "@fortawesome/free-solid-svg-icons";

const questionsAndAnswers = [
  {
    id: 1,
    category: "Materiales",
    icon: faShirt,
    question: "¿Qué materiales utilizan para la ropa personalizada?",
    answer: "Utilizamos algodón jersey 24/1 de alta calidad y estampado DTF (Direct to Film) que garantiza durabilidad excepcional, colores vivos y resistencia al lavado. Nuestros materiales son certificados y libres de químicos nocivos.",
  },
  {
    id: 2,
    category: "Envíos",
    icon: faTruck,
    question: "¿Cuánto tiempo demora la entrega de los pedidos?",
    answer: "En Lima: 2-3 días hábiles. En provincias: 5-7 días hábiles. Para pedidos urgentes ofrecemos servicio express con entrega en 24 horas (solo Lima) con costo adicional.",
  },
  {
    id: 3,
    category: "Envíos",
    icon: faMapMarkerAlt,
    question: "¿Ofrecen envíos a provincias?",
    answer: "¡Sí! Realizamos envíos a todas las provincias del Perú a través de Olva Courier, Shalom y otros servicios confiables. El costo de envío se calcula automáticamente según el destino.",
  },
  {
    id: 4,
    category: "Personalización",
    icon: faPalette,
    question: "¿Puedo personalizar completamente un diseño?",
    answer: "¡Absolutamente! Puedes enviar tu propio diseño, logo, frase o imagen. También ofrecemos servicio de diseño personalizado sin costo adicional. Aceptamos archivos en PNG, JPG, PDF o vectoriales.",
  },
  {
    id: 5,
    category: "Ventas",
    icon: faShirt,
    question: "¿Aceptan pedidos al por mayor?",
    answer: "Sí, ofrecemos precios especiales para pedidos desde 10 prendas. Contamos con descuentos escalonados: 10+ prendas (10% dto), 25+ prendas (15% dto), 50+ prendas (20% dto).",
  },
  {
    id: 6,
    category: "Tallas",
    icon: faShirt,
    question: "¿Cómo puedo saber mi talla?",
    answer: "Tenemos una guía de tallas detallada con medidas específicas. También puedes enviarnos tus medidas por WhatsApp y te ayudamos a elegir la talla perfecta. Trabajamos desde XS hasta 3XL.",
  },
  {
    id: 7,
    category: "Personalización",
    icon: faPalette,
    question: "¿Qué tipo de diseños puedo estampar?",
    answer: "Puedes estampar logos empresariales, frases motivacionales, ilustraciones, fotografías, diseños de anime, deportes, y cualquier arte que refleje tu personalidad. Sin límites de creatividad.",
  },
  {
    id: 8,
    category: "Cuidado",
    icon: faSprayCan,
    question: "¿El estampado se puede lavar sin problemas?",
    answer: "Nuestro estampado DTF está diseñado para durar más de 50 lavados manteniendo calidad. Recomendaciones: lavar con agua fría, al revés, no usar lejía, planchar por el reverso.",
  },
  {
    id: 9,
    category: "Garantía",
    icon: faShieldAlt,
    question: "¿Qué pasa si recibo un producto defectuoso?",
    answer: "Ofrecemos garantía total. Si hay algún defecto, contáctanos en las primeras 48 horas y gestionamos cambio o reembolso completo. Tu satisfacción es nuestra prioridad.",
  },
  {
    id: 10,
    category: "Tienda",
    icon: faMapMarkerAlt,
    question: "¿Tienen tienda física?",
    answer: "Actualmente somos 100% online para ofrecerte mejores precios. Brindamos atención personalizada por WhatsApp, Instagram y correo. ¡La experiencia digital de Yorusito es única!",
  },
];

interface FAQListProps {
  searchQuery: string;
}

export default function FAQList({ searchQuery }: FAQListProps) {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const filteredQuestions = questionsAndAnswers.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleQuestion = (id: number) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No se encontraron preguntas con "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((item) => (
              <div 
                key={item.id}
                className="border-2 border-black overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className="text-2xl flex-shrink-0"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold mt-1">
                        {item.question}
                      </h3>
                    </div>
                  </div>
                  <FontAwesomeIcon 
                    icon={activeQuestion === item.id ? faChevronUp : faChevronDown}
                    className="text-xl ml-4 flex-shrink-0"
                  />
                </button>
                
                {activeQuestion === item.id && (
                  <div className="px-6 pb-6 bg-gray-50 border-t-2 border-black">
                    <p className="text-gray-700 leading-relaxed pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
