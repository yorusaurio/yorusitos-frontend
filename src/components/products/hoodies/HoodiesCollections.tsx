const collections = [
  {
    name: "Urban Legends",
    description: "Hoodies con diseños inspirados en las leyendas urbanas más icónicas",
    badge: "Próximo Lanzamiento"
  },
  {
    name: "Comfort Zone",
    description: "La máxima comodidad en hoodies oversized para el día a día",
    badge: "En Desarrollo"
  },
  {
    name: "Street Art",
    description: "Colaboraciones con artistas locales para diseños únicos",
    badge: "Próximamente"
  }
];

export default function HoodiesCollections() {
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            Próximas Colecciones
          </h2>
          <p className="text-lg text-gray-400">
            Prepárate para el lanzamiento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div 
              key={index}
              className="border-2 border-white p-8 hover:bg-white hover:text-black transition-all duration-300 group"
            >
              <div className="mb-4">
                <span className="text-xs font-bold px-3 py-1 bg-white text-black group-hover:bg-black group-hover:text-white border border-current">
                  {collection.badge}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">
                {collection.name}
              </h3>
              
              <p className="text-sm opacity-80">
                {collection.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
