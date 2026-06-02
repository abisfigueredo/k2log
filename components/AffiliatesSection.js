"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Gift, Percent, Users } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/** Asset en `public/images/affiliates.png`. */
const AFFILIATES_BG = "/images/affiliates.png";

const BENEFIT_CARDS = [
  {
    icon: Gift,
    text: "Regalos exclusivos y lanzamientos previos",
  },
  {
    icon: Percent,
    text: "Comisiones por cada compra referida",
  },
  {
    icon: Users,
    text: "Acceso a nuestra comunidad VIP",
  },
];

export function AffiliatesSection() {
  const reduceMotion = useReducedMotion();
  const [toastOpen, setToastOpen] = useState(false);

  const showConstructionToast = useCallback(() => {
    setToastOpen(true);
  }, []);

  useEffect(() => {
    if (!toastOpen) return;
    const t = window.setTimeout(() => setToastOpen(false), 3800);
    return () => window.clearTimeout(t);
  }, [toastOpen]);

  return (
    <section
      id="afiliados"
      className="relative z-10 -mt-[2.25rem] flex min-h-dvh w-full max-w-full flex-col overflow-x-hidden bg-k2-peach sm:-mt-[2.75rem] md:-mt-[3.25rem] lg:-mt-[3.75rem]"
      aria-labelledby="afiliados-heading"
    >
      <div className="grid min-h-dvh w-full min-w-0 max-w-full flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] pt-2 sm:pt-3 md:grid-cols-2 md:grid-rows-1 md:items-stretch md:pt-[clamp(0.875rem,2.75vh,1.625rem)] lg:pt-[clamp(1.125rem,3.25vh,1.875rem)]">
        {/* Columna izquierda — imagen a ancho completo */}
        <div className="relative min-h-[min(42dvh,20rem)] w-full overflow-hidden bg-k2-peach md:min-h-full md:h-full">
          <Image
            src={AFFILIATES_BG}
            alt="Comunidad de mujeres y estilo de vida K2Log"
            fill
            className="object-cover object-top sm:object-top md:object-[18%_top] lg:object-[16%_top]"
            sizes="100vw"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-k2-peach/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-k2-peach/15 md:to-k2-peach/90"
            aria-hidden
          />
        </div>

        {/* Columna derecha — contenido */}
        <div className="box-border flex min-h-full min-w-0 w-full max-w-full flex-col justify-center overflow-x-hidden pl-2.5 pr-2 pt-7 pb-4 sm:pl-3.5 sm:pr-3 sm:pt-8 sm:pb-8 md:min-h-dvh md:justify-start md:pl-4.5 md:pr-4 md:pt-[clamp(2.25rem,5.5vh,3.25rem)] md:pb-10 lg:pl-6 lg:pr-5 lg:pt-[clamp(2.5rem,6.5vh,3.75rem)] lg:pb-12">
          <div className="flex w-full max-w-lg flex-col md:mt-[clamp(0.4rem,1.5vh,1rem)]">
          <motion.header
            className="max-w-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mt-2 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-k2-terracotta sm:mt-2.5 sm:text-xs md:mt-3">
              Programa de afiliados
            </p>
            <h2
              id="afiliados-heading"
              className="font-display mt-2 text-2xl font-semibold leading-[1.12] text-k2-ink sm:mt-2.5 sm:text-3xl md:mt-3 lg:text-[2.15rem]"
            >
              Únete a una comunidad que brilla contigo
            </h2>
            <p className="mt-3 font-sans text-sm font-medium leading-snug text-k2-ink/88 sm:mt-3.5 md:mt-4 sm:text-base">
              Afiliadas K2Log: lifestyle, beneficios reales y voz propia.
            </p>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-k2-ink/78 sm:mt-3 md:mt-4 sm:text-[0.9375rem]">
              Forma parte de un círculo exclusivo de creadoras y aliadas que comparten
              la rutina de cuidado natural K2Log y reciben recompensas por cada persona
              que inspiran.
            </p>
          </motion.header>

          <ul className="mt-3 flex max-w-lg flex-col gap-2 sm:mt-4 sm:gap-2.5" role="list">
            {BENEFIT_CARDS.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                className="flex items-center gap-2.5 rounded-xl border border-k2-ink/10 bg-k2-white/25 px-3 py-2.5 shadow-sm shadow-k2-ink/5 backdrop-blur-md sm:gap-3 sm:px-3.5 sm:py-3"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: reduceMotion ? 0 : 0.15 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-k2-orange/25 bg-k2-orange/15 text-k2-terracotta sm:size-10">
                  <Icon className="size-4 sm:size-[1.125rem]" strokeWidth={1.85} aria-hidden />
                </span>
                <span className="font-sans text-xs font-medium leading-snug text-k2-ink sm:text-sm">
                  {text}
                </span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="mt-3 max-w-lg sm:mt-4"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              delay: reduceMotion ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.button
              type="button"
              onClick={showConstructionToast}
              className="relative inline-flex min-h-[2.75rem] w-full items-center justify-center overflow-hidden rounded-full bg-k2-white px-6 py-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-k2-terracotta shadow-lg shadow-black/12 ring-2 ring-k2-orange/10 transition-colors hover:bg-k2-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-terracotta sm:min-h-[3rem] sm:px-7 sm:text-[0.75rem]"
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        "0 20px 40px rgba(34, 22, 16, 0.12)",
                        "0 24px 48px rgba(228, 111, 5, 0.18)",
                        "0 20px 40px rgba(34, 22, 16, 0.12)",
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                    }
              }
            >
              Quiero ser afiliado K2Log
            </motion.button>
            <p className="mt-3 text-center font-sans text-[0.65rem] font-medium text-k2-ink/65 sm:text-xs">
              +500 mujeres ya están brillando con nosotros
            </p>
          </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toastOpen ? (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[100] w-[min(calc(100vw-2rem),22rem)] -translate-x-1/2 rounded-2xl border border-k2-ink/10 bg-k2-ink/92 px-5 py-3.5 text-center shadow-2xl shadow-black/30 backdrop-blur-md"
          >
            <p className="font-sans text-sm font-medium leading-snug text-k2-peach">
              Estamos preparando tu registro. Muy pronto podrás unirte aquí.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
