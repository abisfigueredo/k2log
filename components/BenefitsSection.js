"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Convención: `public/images/{slug}.png` (p. ej. deep-hydration.png). */
const benefitSrc = (slug) => `/images/${slug}.png`;

/** Igual que `cardBoxClass` en BottleScroll360 (tarjetas informativas del frasco). */
const benefitTileRounded = "rounded-[clamp(10px,2vw,14px)]";

const TILES = [
  {
    area: "benefits-soft",
    slug: "soft-leather",
    title: "Piel suave al instante",
    textPlacement: "top-left",
  },
  {
    area: "benefits-deep",
    slug: "deep-hydration",
    title: "Hidratación profunda",
    subtitle: "Nutre tu piel desde las capas más profundas.",
    textPlacement: "top-left",
  },
  {
    area: "benefits-shine",
    slug: "natural-shine",
    title: "Brillo natural",
    subtitle: "Resalta tu luminosidad natural todos los días.",
    textPlacement: "top-left",
  },
  {
    area: "benefits-nat",
    slug: "natural-ingredients",
    title: "Ingredientes 100% naturales",
    subtitle: "Seleccionados cuidadosamente para tu bienestar.",
    textPlacement: "top-left",
  },
  {
    area: "benefits-rapid",
    slug: "rapid-absorption",
    title: "Absorción rápida",
    subtitle: "Fórmula ligera que se absorbe sin dejar sensación grasosa.",
    textPlacement: "top-left",
  },
  {
    area: "benefits-mild",
    slug: "mild-scent",
    title: "Aroma suave y relajante",
    subtitle: "Convierte tu rutina en un momento de bienestar.",
    textPlacement: "top-left",
  },
];

const tileTitleClass =
  "font-display text-xl font-semibold leading-tight tracking-[0.01em] text-k2-white md:text-2xl [text-shadow:0_1px_0_rgb(0_0_0_/_.55)]";

/* Subtítulo más melocotón / menos contraste vs. título blanco (similar a texto secundario en secciones claras). */
const tileSubtitleClass =
  "mt-[clamp(0.5rem,1.75vw,0.6875rem)] font-sans text-[0.6875rem] font-normal leading-snug tracking-[0.01em] text-k2-peach/90 sm:text-xs md:mt-[0.6875rem] md:text-[0.8125rem] md:leading-relaxed [text-shadow:0_1px_1px_rgb(0_0_0_/_.25)]";

/** Bloque título + subtítulo: misma escala en todas las tarjetas (móvil → xl). */
const tileCopyMaxClass =
  "w-full max-w-[9rem] sm:max-w-[9.875rem] md:max-w-[10.75rem] lg:max-w-[11.75rem] xl:max-w-[12.75rem]";

function BenefitTile({ slug, title, subtitle, area, textPlacement, staggerIndex }) {
  const topLeft = textPlacement === "top-left";
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`benefits-tile ${area} group relative isolate min-h-[220px] overflow-hidden shadow-lg shadow-k2-ink/10 ring-1 ring-k2-ink/10 md:min-h-0 ${benefitTileRounded}`}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.52,
        delay: reduceMotion ? 0 : staggerIndex * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Image
        src={benefitSrc(slug)}
        alt={title}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 36vw, (max-width: 1535px) 34vw, 32vw"
      />
      <div
        className={
          topLeft
            ? "pointer-events-none absolute inset-0 bg-gradient-to-b from-k2-ink/85 via-k2-ink/35 to-transparent"
            : "pointer-events-none absolute inset-0 bg-gradient-to-t from-k2-ink/85 via-k2-ink/35 to-transparent"
        }
        aria-hidden
      />
      <div
        className={`benefits-tile-copy relative z-10 flex h-full min-h-[220px] flex-col p-5 text-left md:min-h-0 md:p-6 ${
          topLeft ? "items-start justify-start" : "justify-end"
        }`}
      >
        <div className={tileCopyMaxClass}>
          <h3 className={topLeft ? `${tileTitleClass} leading-[1.15]` : tileTitleClass}>
            {title}
          </h3>
          {subtitle ? <p className={tileSubtitleClass}>{subtitle}</p> : null}
        </div>
      </div>
    </motion.article>
  );
}

export function BenefitsSection() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.top < vh * 0.9 && r.bottom > vh * 0.05) {
      setInView(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: [0, 0.1, 0.18] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beneficios"
      className={`k2-benefits-section relative z-10 -mt-[3rem] overflow-hidden bg-k2-orange px-3 pb-[3.5rem] pt-11 sm:-mt-[3.75rem] sm:px-5 sm:pb-[4.25rem] sm:pt-[3.25rem] md:-mt-[5.5rem] md:px-7 md:pb-[5.25rem] md:pt-16 lg:px-8 xl:px-9 2xl:px-10${inView ? " k2-benefits-section--in-view" : ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="k2-benefits-gradient-motion absolute inset-0" />
      </div>
      <div
        aria-hidden
        className="k2-benefits-top-wave pointer-events-none absolute inset-x-0 -top-3 z-[1] h-[clamp(8rem,19vw,12.5rem)] w-full sm:-top-4 md:-top-5"
      />

      <div className="relative z-10 mx-auto w-full max-w-[min(100%,88rem)] xl:max-w-[min(100%,93rem)] 2xl:max-w-[min(98rem,calc(100vw-6rem))]">
        <header className="k2-benefits-reveal-head relative z-10 mx-auto mb-2 mt-3 max-w-2xl text-center sm:mt-4 md:mt-5 md:mb-3">
          <p className="mb-[clamp(0.375rem,1.5vw,0.5rem)] font-sans text-xs font-semibold uppercase tracking-[0.35em] text-k2-peach">
            Beneficios
          </p>
          <h2 className="mb-[clamp(0.625rem,2.5vw,0.75rem)] font-display text-3xl font-semibold leading-tight text-k2-white sm:text-4xl md:text-[2.65rem] [text-shadow:0_2px_12px_rgb(0_0_0_/_.12)]">
            Lo que tu piel va a amar
          </h2>
          <p className="font-sans text-base font-light leading-relaxed text-k2-peach/88">
            Fórmula natural que nutre, protege y realza tu belleza natural.
          </p>
        </header>

        <div className="benefits-collage">
          {TILES.map((tile, i) => (
            <BenefitTile key={tile.slug} {...tile} staggerIndex={i} />
          ))}
        </div>

        {/*
          Mismo ancho que el collage (= borde exterior del mosaico en todas las resoluciones;
          coincide con lateral de «Ingredientes…» hasta «Aroma suave» en escritorio).
        */}
        {/*
          Misma escala collage→botón y botón→marca (`mt-*` exterior = distancia última tarjeta;
          `gap-*` interior = misma separación antes de «BENEFICIOS», sin translate que “baje” el texto).
        */}
        <div className="k2-benefits-reveal-footer relative z-10 isolate mt-8 flex w-full flex-col items-stretch gap-8 sm:mt-9 sm:gap-9 md:mt-10 md:gap-10">
          <div className="relative z-20 flex shrink-0 justify-center">
            <Link
              href="#producto"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-k2-white px-10 py-2.5 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-k2-terracotta shadow-xl shadow-black/20 transition hover:bg-k2-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-white"
            >
              Descúbrelo ahora
            </Link>
          </div>
          <div
            aria-hidden
            className="pointer-events-none relative z-0 flex w-full shrink-0 justify-center overflow-visible"
          >
            <div className="k2-benefits-watermark-wrap w-full max-w-full -translate-y-2 md:-translate-y-3 xl:-translate-y-4">
              <span className="k2-benefits-watermark-text">BENEFICIOS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
