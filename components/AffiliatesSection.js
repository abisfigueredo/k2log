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
      className="relative z-10 -mt-[2.75rem] w-full overflow-x-hidden bg-k2-peach sm:-mt-[3.25rem] md:-mt-[4rem] md:min-h-[min(78dvh,40rem)] lg:-mt-[4.5rem] lg:min-h-[min(82dvh,42rem)]"
      aria-labelledby="afiliados-heading"
    >
      <div className="grid min-h-full w-full grid-cols-1 md:min-h-[inherit] md:grid-cols-2 md:items-stretch">
        {/* Columna izquierda — imagen */}
        <div className="relative h-[min(28vh,12.5rem)] w-full sm:h-[min(31vh,14rem)] md:h-full md:min-h-[inherit]">
          <Image
            src={AFFILIATES_BG}
            alt="Comunidad de mujeres y estilo de vida K2Log"
            fill
            className="object-cover object-[50%_22%] sm:object-[50%_18%] md:object-[14%_50%]"
            sizes="(max-width: 767px) 100vw, 50vw"
            priority={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-k2-peach via-k2-peach/25 to-transparent md:bg-gradient-to-r md:from-transparent md:via-k2-peach/20 md:to-k2-peach"
            aria-hidden
          />
        </div>

        {/* Columna derecha — contenido */}
        <div className="flex flex-col justify-center px-5 pt-8 pb-6 sm:px-7 sm:pt-10 sm:pb-8 md:px-9 md:pt-12 md:pb-10 lg:px-12 lg:pt-14 lg:pb-12">
          <motion.header
            className="max-w-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-k2-terracotta">
              Programa de afiliados
            </p>
            <h2
              id="afiliados-heading"
              className="font-display mt-2 text-3xl font-semibold leading-[1.12] text-k2-ink sm:text-4xl lg:text-[2.65rem]"
            >
              Únete a una comunidad que brilla contigo
            </h2>
            <p className="mt-2 font-sans text-base font-medium leading-snug text-k2-ink/88 sm:text-lg">
              Afiliadas K2Log: lifestyle, beneficios reales y voz propia.
            </p>
            <p className="mt-4 font-sans text-base font-light leading-relaxed text-k2-ink/78">
              Forma parte de un círculo exclusivo de creadoras y aliadas que comparten
              la rutina de cuidado natural K2Log y reciben recompensas por cada persona
              que inspiran.
            </p>
          </motion.header>

          <ul className="mt-7 flex max-w-xl flex-col gap-2.5 sm:mt-8 sm:gap-3" role="list">
            {BENEFIT_CARDS.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                className="flex items-center gap-3 rounded-2xl border border-k2-ink/10 bg-k2-white/25 px-4 py-3 shadow-sm shadow-k2-ink/5 backdrop-blur-md sm:gap-3.5 sm:px-[1.125rem] sm:py-3.5"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: reduceMotion ? 0 : 0.15 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-k2-orange/25 bg-k2-orange/15 text-k2-terracotta sm:size-11">
                  <Icon className="size-[1.125rem] sm:size-5" strokeWidth={1.85} aria-hidden />
                </span>
                <span className="font-sans text-sm font-medium leading-snug text-k2-ink sm:text-[0.9375rem]">
                  {text}
                </span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="mt-7 max-w-xl sm:mt-8"
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
              className="relative inline-flex min-h-[3rem] w-full items-center justify-center overflow-hidden rounded-full bg-k2-white px-8 py-3 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-k2-terracotta shadow-xl shadow-black/15 ring-2 ring-k2-orange/10 transition-colors hover:bg-k2-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-terracotta sm:min-h-[3.25rem] sm:text-[0.8125rem]"
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
            <p className="mt-4 text-center font-sans text-xs font-medium text-k2-ink/65 sm:text-sm">
              +500 mujeres ya están brillando con nosotros
            </p>
          </motion.div>
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
