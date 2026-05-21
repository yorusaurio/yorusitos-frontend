import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTshirt } from "@fortawesome/free-solid-svg-icons";

export default function PantsHero() {
  return (
    <section className="bg-white text-black pt-24 pb-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
            <FontAwesomeIcon icon={faTshirt} className="text-3xl text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            Pantalones Premium
          </h1>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Versatilidad y estilo para cada ocasión. Próximamente.
          </p>
          
          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold">
            COMING SOON
          </div>
        </div>
      </div>
    </section>
  );
}
