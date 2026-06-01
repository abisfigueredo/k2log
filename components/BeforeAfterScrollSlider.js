"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const ANTES_SRC = "/images/before-k2log.png";
const DESPUES_SRC = "/images/after-k2log.png";
const K2LOG_KEY_ICON_SRC = "/images/icon-k2log-ffffff.png";

/** Altura de scroll extra (vh) mientras la comparación permanece fija (pin). */
const PIN_SCROLL_VH = 2.2;
/**
 * Tras tener la sección fija a pantalla completa (sticky), scroll extra antes de que
 * avance el reveal — ~un gesto de rueda, acotado en px para móvil/escritorio.
 */
const REVEAL_LEAD_IN_MIN_PX = 52;
const REVEAL_LEAD_IN_VH = 0.12;
const REVEAL_LEAD_IN_MAX_PX = 168;
/** A partir de este progreso (0–1) la línea y el botón bajan opacidad hasta desaparecer al llegar a 1. */
const DIVIDER_FADE_START = 0.76;

/** Ancho máximo del mensaje (≈418.76px a 16px root); el `min()` con vw lo hace responsive. */
const MESSAGE_MAX_WIDTH_REM = 26.172;

export function BeforeAfterScrollSlider({ id = "antes-despues" }) {
  const outerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const updateScrollProgress = useCallback(() => {
    const section = outerRef.current;
    if (!section) return;
    const vh = window.innerHeight;
    const scrollRange = section.offsetHeight - vh;
    const rect = section.getBoundingClientRect();

    if (scrollRange <= 0) {
      setProgress(1);
      return;
    }

    // Hasta que el borde superior de la sección no llega al tope del viewport, sin reveal
    if (rect.top > 0) {
      setProgress(0);
      return;
    }

    const leadIn = Math.min(
      Math.max(vh * REVEAL_LEAD_IN_VH, REVEAL_LEAD_IN_MIN_PX),
      REVEAL_LEAD_IN_MAX_PX,
    );
    const pastPin = -rect.top;
    const scrubRange = Math.max(scrollRange - leadIn, 1);
    const p = Math.min(1, Math.max(0, (pastPin - leadIn) / scrubRange));
    setProgress(p);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateScrollProgress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScrollProgress();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateScrollProgress]);

  const topInsetPct = (1 - progress) * 100;
  const clipPath = `inset(${topInsetPct}% 0 0 0)`;
  /** Costura = mismo porcentaje que el recorte superior (comportamiento tipo HTML de referencia). */
  const seamTopPct = topInsetPct;

  const p = Math.min(1, Math.max(0, progress));
  const labelAntesOpacity = 1 - p;
  const labelDespuesOpacity = p;
  const dividerHandleOpacity =
    p <= DIVIDER_FADE_START
      ? 1
      : Math.max(0, 1 - (p - DIVIDER_FADE_START) / (1 - DIVIDER_FADE_START));

  /** Mismo ritmo paulatino que la etiqueta DESPUÉS (opacidad = progreso). */
  const centerMessageOpacity = p;

  /** Scroll cue: desvanecer al iniciar el scrub (ref. > 0.04). */
  const cueOpacity = p <= 0.02 ? 1 : p >= 0.07 ? 0 : 1 - (p - 0.02) / 0.05;

  return (
    <section
      ref={outerRef}
      id={id}
      className="relative z-[50] w-full"
      style={{ height: `${PIN_SCROLL_VH * 100}vh` }}
      aria-label="Comparación antes y después del cuidado con K2Log"
    >
      <div className="sticky top-0 z-[50] flex h-dvh min-h-dvh w-full items-stretch overflow-hidden bg-k2-ink">
        <div className="relative isolate h-dvh min-h-0 w-full max-w-[100vw]">
          <div className="absolute inset-0 z-[1]">
            <Image
              src={ANTES_SRC}
              alt="Piel antes del ritual de hidratación con K2Log"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </div>

          <div
            className="absolute inset-0 z-[2] overflow-hidden [will-change:clip-path]"
            style={{
              clipPath,
              WebkitClipPath: clipPath,
            }}
            aria-hidden={progress <= 0}
          >
            <Image
              src={DESPUES_SRC}
              alt="Piel hidratada y radiante después de K2Log"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          {/* Línea + control: misma Y que la costura del clip (prototipo HTML scroll) */}
          <div
            className="pointer-events-none absolute inset-x-0 z-[25] flex h-[52px] items-center justify-center md:h-[58px] [will-change:top,opacity]"
            style={{
              top: `${seamTopPct}%`,
              transform: "translateY(-50%)",
              opacity: dividerHandleOpacity,
            }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-x-0 top-1/2 z-0 h-[2px] -translate-y-1/2 bg-[linear-gradient(to_right,transparent_0%,rgba(228,111,5,0.4)_15%,#e46f05_50%,rgba(228,111,5,0.4)_85%,transparent_100%)] shadow-[0_0_18px_rgba(228,111,5,0.6),0_0_6px_rgba(255,229,204,0.5)]"
              aria-hidden
            />
            <span
              className="pointer-events-none relative z-[1] flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border-[2.5px] border-k2-peach bg-k2-orange text-k2-white shadow-[0_0_0_5px_rgba(228,111,5,0.2),0_4px_20px_rgba(0,0,0,0.3)] md:h-[52px] md:w-[52px]"
              aria-hidden
            >
              <ChevronLeft
                className="pointer-events-none absolute left-0.5 top-1/2 h-2 w-2 -translate-y-1/2 text-k2-white opacity-90 md:left-1 md:h-2.5 md:w-2.5"
                strokeWidth={2}
                aria-hidden
              />
              <Image
                src={K2LOG_KEY_ICON_SRC}
                alt=""
                width={44}
                height={44}
                className="h-8 w-8 shrink-0 object-contain md:h-9 md:w-9"
              />
              <ChevronRight
                className="pointer-events-none absolute right-0.5 top-1/2 h-2 w-2 -translate-y-1/2 text-k2-white opacity-90 md:right-1 md:h-2.5 md:w-2.5"
                strokeWidth={2}
                aria-hidden
              />
            </span>
          </div>

          <div
            className="pointer-events-none absolute left-[clamp(20px,4vw,64px)] top-[clamp(24px,5vh,60px)] z-[40] flex flex-col gap-1 max-md:left-[18px] max-md:top-5 [will-change:opacity]"
            style={{ opacity: labelAntesOpacity }}
            aria-hidden="true"
          >
            <span className="font-sans text-[clamp(10px,1vw,12px)] font-semibold uppercase tracking-[0.44em] text-k2-orange [text-shadow:0_1px_4px_rgb(255_255_255/0.7)]">
              ANTES
            </span>
            <span className="font-k2-brand-name font-display text-[clamp(26px,2.85vw,40px)] font-semibold leading-[1.1] text-[#221610] [text-shadow:0_1px_8px_rgb(255_229_204/0.8)]">
              Sin K2LOG
            </span>
          </div>
          <div
            className="pointer-events-none absolute bottom-[clamp(24px,5vh,60px)] right-[clamp(20px,4vw,64px)] z-[40] flex flex-col items-end gap-1 text-right max-md:bottom-5 max-md:right-[18px] [will-change:opacity]"
            style={{ opacity: labelDespuesOpacity }}
            aria-hidden="true"
          >
            <span className="font-sans text-[clamp(10px,1vw,12px)] font-semibold uppercase tracking-[0.44em] text-k2-orange [text-shadow:0_1px_4px_rgb(255_255_255/0.7)]">
              DESPUÉS
            </span>
            <span className="font-k2-brand-name font-display text-[clamp(26px,2.85vw,40px)] font-semibold leading-[1.1] text-[#221610] [text-shadow:0_1px_8px_rgb(255_229_204/0.8)]">
              Con K2LOG
            </span>
          </div>

          {/* Copy + glass — esquina superior izquierda; anchos y márgenes fluidos (clamp/min) */}
          <div
            className="absolute left-[clamp(16px,4vw,64px)] top-[clamp(5.75rem,20vh,10rem)] z-[45] max-w-full text-left [will-change:opacity] sm:left-[clamp(20px,4vw,64px)] sm:top-[clamp(6.5rem,22vh,10rem)]"
            style={{
              opacity: centerMessageOpacity,
              pointerEvents: centerMessageOpacity > 0.08 ? "auto" : "none",
              width: `min(${MESSAGE_MAX_WIDTH_REM}rem, calc(100vw - clamp(16px, 4vw, 64px) - clamp(12px, 3vw, 40px)))`,
            }}
          >
            <div
              className="pointer-events-none absolute rounded-[clamp(10px,2vw,14px)] border border-[rgba(228,111,5,0.18)] bg-[rgba(255,240,220,0.65)]"
              style={{
                top: "clamp(-22px, -3.5vw, -18px)",
                bottom: "clamp(-22px, -3.5vw, -18px)",
                left: "clamp(-32px, -3vw, -16px)",
                right: "clamp(-32px, -3vw, -16px)",
                backdropFilter: "blur(clamp(8px, 2vw, 11px))",
                WebkitBackdropFilter: "blur(clamp(8px, 2vw, 11px))",
              }}
              aria-hidden
            />
            <div className="relative px-[clamp(2px,0.5vw,4px)]">
              <p className="mb-[clamp(6px,1.5vw,8px)] font-sans text-[clamp(7px,0.68vw,9px)] font-semibold uppercase tracking-[0.35em] text-k2-orange">
                Key to Log
              </p>
              <h2 className="mb-[clamp(10px,2.5vw,12px)] font-display text-[clamp(1.5rem,3.6vw,2.6875rem)] font-semibold leading-[1.07] tracking-[0.01em] text-[#221610]">
                La llave que
                <br />
                transforma tu piel
              </h2>
              <p className="mb-[clamp(14px,3.5vw,18px)] font-sans text-[clamp(0.6875rem,1.05vw,0.8125rem)] font-light leading-[1.65] text-[rgba(34,22,16,0.78)]">
                Aceite corporal 100% natural.
                <br />
                Hidratación profunda, brillo real.
              </p>
              <a
                href="#producto"
                className="inline-flex max-w-full items-center justify-center rounded-full bg-k2-orange font-sans font-semibold uppercase tracking-[0.18em] text-k2-white shadow-[0_3px_14px_rgba(228,111,5,0.45)] transition-[background,box-shadow] duration-200 hover:bg-k2-terracotta hover:shadow-[0_5px_19px_rgba(221,81,22,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-orange"
                style={{
                  minHeight: "clamp(34px, 9vw, 37px)",
                  paddingLeft: "clamp(1rem, 3.5vw, 1.5rem)",
                  paddingRight: "clamp(1rem, 3.5vw, 1.5rem)",
                  fontSize: "clamp(9px, 2.2vw, 10px)",
                }}
              >
                Descubre el aceite
              </a>
            </div>
          </div>

          {/* Aviso scroll inferior — mismo copy y ritmo que el HTML de referencia */}
          <div
            className="pointer-events-none absolute left-1/2 z-[46] flex max-w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 flex-col items-center gap-[5px] px-3 [will-change:opacity]"
            style={{
              opacity: cueOpacity,
              bottom: "clamp(36px, 7.5vh, 64px)",
            }}
            aria-hidden="true"
          >
            <div
              className={`flex flex-col items-center gap-1 ${cueOpacity > 0.05 && !reduceMotion ? "k2ba-scroll-cue-anim" : ""}`}
            >
              <span className="text-center font-sans text-[clamp(8px,2.4vw,10px)] font-medium uppercase tracking-[0.32em] text-k2-ink/90">
                Haz scroll para ver la diferencia
              </span>
              <svg
                className="h-[clamp(15px,4.2vw,20px)] w-[clamp(15px,4.2vw,20px)] shrink-0 text-k2-ink/75"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
