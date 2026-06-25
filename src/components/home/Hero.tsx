"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const HERO_SLIDES = [
  {
    src: "/images/herocristiano.png",
    alt: "SuperStars Collection 2026 — Cristiano Ronaldo",
  },
  {
    src: "/images/heroneymar.png",
    alt: "SuperStars Collection 2026 — Neymar Jr",
  },
] as const;

const SLIDE_INTERVAL_MS = 7000;

const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== activeSlide}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            width={1672}
            height={941}
            className="h-full w-full object-cover object-center"
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

      <div className="relative z-10 flex min-h-screen items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-xl lg:max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.42em] text-white/65 sm:text-xs">
              Nueva colección
            </p>

            <h1 className="mt-5">
              <span className="block text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
                SuperStars
              </span>
              <span className="mt-3 block text-2xl font-light tracking-wide text-white/85 sm:text-3xl lg:text-4xl">
                Collection 2026
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg sm:leading-8">
              Diseños exclusivos creados para destacar.
              <br className="hidden sm:block" />
              Polos premium con estampados únicos,
              <br className="hidden sm:block" />
              listos para usar o personalizar a tu estilo.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/products/polos?collection=SuperStars">
                <button className="group flex w-full items-center justify-center gap-3 bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-black transition-colors duration-300 hover:bg-white/90 sm:w-auto">
                  Explorar colección
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </Link>

              <Link href="/contact">
                <button className="w-full border border-white/35 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-white/10 sm:w-auto">
                  Personalizar diseño
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Ver imagen ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeSlide ? "w-10 bg-white" : "w-3 bg-white/35 hover:bg-white/55"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
