import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

export default function FAQHero() {
  return (
    <section className="bg-white text-black py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-3xl text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Preguntas Frecuentes
          </h1>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Todo lo que necesitas saber sobre Yorusito
          </p>
        </div>
      </div>
    </section>
  );
}
