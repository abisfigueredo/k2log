import Image from "next/image";
import { QuickBuyCard } from "./QuickBuyCard";

/** Video principal en /public/videos/hero.mp4 */
const HERO_VIDEO_SRC = "/videos/hero.mp4";

export function HeroBanner() {
  return (
    <section
      id="inicio"
      className="relative z-0 min-h-dvh w-full overflow-hidden"
      aria-label="Presentación principal"
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/aceite-k2log.png"
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Overlay premium: melocotón + terracota del manual (suave, legible) */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[rgb(255_229_204/0.52)] via-[rgb(221_81_22/0.38)] to-[rgb(34_22_16/0.62)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[2] bg-k2-terracotta/15 mix-blend-multiply"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 pb-20 pt-20 text-center text-k2-white sm:px-8 sm:pb-36 md:pb-32">
        <p className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.45em] text-white/95">
          Key to Log
        </p>
        <div className="mt-1 flex items-center justify-center">
          <Image
            src="/images/icon-k2log-ffffff.png"
            alt="Icono de la marca K2Log"
            width={54}
            height={54}
            className="h-auto w-[3.4rem] sm:w-[4rem]"
            priority
          />
        </div>
        <h1 className="font-display mt-1 max-w-4xl text-4xl font-semibold leading-[1.08] text-k2-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl">
          La llave que te conecta con tu mejor versión
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-white/95 sm:text-lg">
          Aceite corporal multifuncional con aceites 100% naturales. Hidratación
          profunda, sensación sedosa y brillo saludable.
        </p>
        <a
          href="#producto"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-k2-white px-10 py-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-k2-terracotta shadow-xl shadow-black/20 transition hover:bg-k2-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-white"
        >
          Comprar ahora
        </a>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 z-20 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10">
        <QuickBuyCard className="pointer-events-auto" />
      </div>
    </section>
  );
}
