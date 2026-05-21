import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function ContactHero() {
  return (
    <section className="bg-white text-black py-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
            <FontAwesomeIcon icon={faEnvelope} className="text-3xl text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Contáctanos
          </h1>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Estamos aquí para ayudarte. Escríbenos y te responderemos pronto.
          </p>
        </div>
      </div>
    </section>
  );
}
