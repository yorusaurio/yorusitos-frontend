"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const WHATSAPP_URL = "https://wa.me/51975885868?text=¡Hola!%20Quiero%20hablar%20con%20Yorusito.";

const channels = [
  {
    label: "WhatsApp",
    value: "+51 975 885 868",
    hint: "La forma más rápida de hablar con nosotros",
    href: WHATSAPP_URL,
  },
  {
    label: "Correo",
    value: "yorusito.pe@gmail.com",
    hint: "Te respondemos en menos de 24 horas",
    href: "mailto:yorusito.pe@gmail.com",
  },
  {
    label: "Instagram",
    value: "@yorusito_pe",
    hint: "Novedades, diseños y mensajes directos",
    href: "https://instagram.com/yorusito_pe",
  },
];

export default function ContactPageContent() {
  const [startTime, setStartTime] = useState(0);
  const [honeypot, setHoneypot] = useState("");
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
      setFeedback({ type: "error", message: "No se pudo enviar el mensaje. Intenta de nuevo." });
      return;
    }

    if (elapsedTime < 5) {
      setFeedback({ type: "error", message: "Revisa que todo esté bien antes de enviar." });
      return;
    }

    const { name, email, message } = formState;
    if (!name || !email || !message) {
      setFeedback({ type: "error", message: "Completa todos los campos obligatorios." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({ type: "error", message: "Ese correo no parece válido. Revísalo por favor." });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({
        type: "success",
        message: "¡Listo! Recibimos tu mensaje. Te responderemos pronto.",
      });
      setFormState({ name: "", email: "", reason: "general", message: "" });
    }, 1500);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { id, value } = event.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <main className="min-h-screen bg-white pt-20 text-zinc-950">
      <section className="border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-zinc-400">Contacto</p>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            ¿En qué te podemos ayudar?
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-500">
            Cuéntanos lo que necesitas. Por WhatsApp respondemos más rápido, pero también puedes usar el
            formulario o el correo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr,1.1fr] lg:gap-16">
          <div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 flex flex-col rounded-2xl bg-zinc-950 px-6 py-8 text-white transition hover:bg-zinc-800"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-400">Recomendado</p>
              <p className="mt-3 text-2xl font-semibold">Escríbenos por WhatsApp</p>
              <p className="mt-2 text-sm text-zinc-400">+51 975 885 868</p>
              <span className="mt-6 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-950">
                Abrir chat
              </span>
            </a>

            <div className="space-y-6">
              {channels.slice(1).map((channel) => (
                <div key={channel.label} className="border-t border-zinc-200 pt-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-400">{channel.label}</p>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-lg font-medium text-zinc-950 hover:underline"
                  >
                    {channel.value}
                  </a>
                  <p className="mt-1 text-sm text-zinc-500">{channel.hint}</p>
                </div>
              ))}

              <div className="border-t border-zinc-200 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-400">Ubicación</p>
                <p className="mt-2 text-lg font-medium text-zinc-950">Lima, Perú</p>
                <p className="mt-1 text-sm text-zinc-500">Envíos a todo el país</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-zinc-950">Mándanos un mensaje</h2>
            <p className="mt-2 text-sm text-zinc-500">Te respondemos lo antes posible.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-700">
                  Tu nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
                  Tu correo *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="reason" className="mb-2 block text-sm font-medium text-zinc-700">
                  ¿De qué se trata?
                </label>
                <select
                  id="reason"
                  value={formState.reason}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                >
                  <option value="general">Una consulta general</option>
                  <option value="order">Sobre mi pedido</option>
                  <option value="custom">Quiero personalizar un diseño</option>
                  <option value="wholesale">Pedido al por mayor</option>
                  <option value="other">Otra cosa</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-zinc-700">
                  Tu mensaje *
                </label>
                <textarea
                  id="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Cuéntanos qué necesitas..."
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
                  required
                />
              </div>

              {feedback ? (
                <p
                  className={`rounded-xl px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              ¿Prefieres ir directo?{" "}
              <Link href="/faq" className="font-medium text-zinc-950 underline underline-offset-2">
                Mira las preguntas frecuentes
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
