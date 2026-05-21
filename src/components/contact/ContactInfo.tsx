import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faInstagram, faFacebook, faTiktok } from "@fortawesome/free-brands-svg-icons";

const contactMethods = [
  {
    icon: faWhatsapp,
    title: "WhatsApp",
    content: "+51 975 885 868",
    description: "Respuesta inmediata",
    link: "https://wa.me/51975885868"
  },
  {
    icon: faEnvelope,
    title: "Email",
    content: "yorusito.pe@gmail.com",
    description: "Respuesta en 24h",
    link: "mailto:yorusito.pe@gmail.com"
  },
  {
    icon: faInstagram,
    title: "Instagram",
    content: "@yorusito_pe",
    description: "Síguenos para novedades",
    link: "https://instagram.com/yorusito_pe"
  },
  {
    icon: faMapMarkerAlt,
    title: "Ubicación",
    content: "Lima, Perú",
    description: "Envíos a todo el país",
    link: null
  }
];

export default function ContactInfo() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            method.link ? (
              <Link 
                key={index}
                href={method.link}
                target="_blank"
                className="group"
              >
                <div className="border-2 border-black p-6 hover:bg-black hover:text-white transition-all duration-300">
                  <FontAwesomeIcon 
                    icon={method.icon} 
                    className="text-4xl mb-4"
                  />
                  <h3 className="text-lg font-bold mb-2">
                    {method.title}
                  </h3>
                  <p className="font-semibold mb-1">
                    {method.content}
                  </p>
                  <p className="text-sm opacity-70">
                    {method.description}
                  </p>
                </div>
              </Link>
            ) : (
              <div 
                key={index}
                className="border-2 border-black p-6"
              >
                <FontAwesomeIcon 
                  icon={method.icon} 
                  className="text-4xl mb-4"
                />
                <h3 className="text-lg font-bold mb-2">
                  {method.title}
                </h3>
                <p className="font-semibold mb-1">
                  {method.content}
                </p>
                <p className="text-sm opacity-70">
                  {method.description}
                </p>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
