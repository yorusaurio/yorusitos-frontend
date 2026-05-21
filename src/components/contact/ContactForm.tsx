"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCheckCircle, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function ContactForm() {
  const [startTime, setStartTime] = useState<number>(0);
  const [honeypot, setHoneypot] = useState<string>("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    reason: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const elapsedTime = (Date.now() - startTime) / 1000;

    if (honeypot) {
      setFeedback({ type: "error", message: "Formulario detectado como spam." });
      return;
    }

    if (elapsedTime < 5) {
      setFeedback({ type: "error", message: "Por favor, completa los campos correctamente." });
      return;
    }

    const { name, email, message } = formState;
    if (!name || !email || !message) {
      setFeedback({ type: "error", message: "Por favor, completa todos los campos." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({ type: "error", message: "Por favor, introduce un correo electrónico válido." });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({ type: "success", message: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto." });
      setFormState({ name: "", email: "", reason: "general", message: "" });
    }, 2000);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">
            Envíanos un mensaje
          </h2>
          <p className="text-lg text-gray-400">
            Completa el formulario y te responderemos pronto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot */}
          <input
            type="text"
            name="honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              id="name"
              value={formState.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none focus:border-gray-300 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none focus:border-gray-300 transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-bold mb-2">
              Motivo de contacto
            </label>
            <select
              id="reason"
              value={formState.reason}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none focus:border-gray-300 transition-colors"
            >
              <option value="general">Consulta general</option>
              <option value="order">Seguimiento de pedido</option>
              <option value="custom">Diseño personalizado</option>
              <option value="wholesale">Pedido al por mayor</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold mb-2">
              Mensaje *
            </label>
            <textarea
              id="message"
              value={formState.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none focus:border-gray-300 transition-colors resize-none"
              required
            />
          </div>

          {feedback && (
            <div className={`p-4 border-2 ${
              feedback.type === "success" 
                ? "bg-green-50 border-green-500 text-green-900" 
                : "bg-red-50 border-red-500 text-red-900"
            }`}>
              <FontAwesomeIcon 
                icon={feedback.type === "success" ? faCheckCircle : faExclamationTriangle}
                className="mr-2"
              />
              {feedback.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                Enviar mensaje
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
