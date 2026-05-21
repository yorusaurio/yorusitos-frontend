const styles = [
  {
    name: "Urban Joggers",
    description: "Comodidad máxima para el día a día con diseños urbanos únicos",
    badge: "Próximo Lanzamiento",
    features: ["Algodón orgánico", "Bolsillos funcionales", "Cordón ajustable"]
  },
  {
    name: "Street Cargo",
    description: "Estilo streetwear con funcionalidad premium y múltiples bolsillos",
    badge: "En Desarrollo",
    features: ["6 bolsillos", "Tela resistente", "Corte relajado"]
  },
  {
    name: "Smart Casual",
    description: "Elegancia casual para ocasiones especiales con toque moderno",
    badge: "Próximamente",
    features: ["Tela premium", "Corte slim", "Fácil cuidado"]
  }
];

export default function PantsStyles() {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            Próximos Estilos
          </h2>
          <p className="text-lg text-gray-400">
            Prepárate para el lanzamiento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {styles.map((style, index) => (
            <div 
              key={index}
              className="border-2 border-white p-8 hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <div className="mb-4">
                <span className="text-xs font-bold px-3 py-1 bg-white text-black group-hover:bg-black group-hover:text-white border border-current">
                  {style.badge}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">
                {style.name}
              </h3>
              
              <p className="text-sm opacity-80 mb-4">
                {style.description}
              </p>

              <ul className="space-y-2">
                {style.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-current"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
