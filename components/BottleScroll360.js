"use client";

import { Droplets, Leaf, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const PIN_SCROLL_VH = 3.5;

const VIEWS = [
  "/images/front-k2log.png",
  "/images/right-k2log.png",
  "/images/back-k2log.png",
  "/images/left-k2log.png",
];

/** Progreso 0–1 → pasos 0–4 (front → right → back → left → front). */
const FACE_BY_STEP = [0, 1, 2, 3, 0];
const DISCRETE_P = [0, 0.25, 0.5, 0.75, 1];

/** Umbral de delta acumulado (px) para contar un “tick”. */
const WHEEL_THRESHOLD = 52;

/** Acumulador máximo para no “tragarse” scroll largo en un solo paso anómalo. */
const WHEEL_ACCUM_CAP = 220;

/** Si el scroll real está cerca de un paso del giro, alinear (evita quedarse entre caras por float). */
const GRID_SNAP_EPS = 0.038;

const LERP = 0.22;
const SNAP_EPS = 0.0035;

/**
 * Parte del tramo entre dos caras (0–1 en espacio vf) donde hay mezcla.
 * Valores bajos = casi todo el recorrido con una sola imagen nítida y un cruce breve.
 */
const CROSSFADE_FRACTION = 0.11;

/** Solo el frasco: en móvil no limitamos altura con dvh (evita encoger por el flex del titular). */
const bottleImgClass =
  "h-auto w-auto shrink-0 object-contain max-md:max-h-none max-w-[min(98vw,1120px)] md:max-h-[min(98dvh,1520px)] sm:max-w-[min(94vw,1280px)]";

/** Inicios del fade-in por tarjeta (0–1 = progreso del pin). Orden: sup. izq → sup. der → inf. der → inf. izq. */
const CARD_REVEAL_STARTS = [0, 0.24, 0.44, 0.64];
const CARD_REVEAL_WIDTH = 0.18;

/** Trazo conector → borde tarjeta BeforeAfter (border-[rgba(228,111,5,0.18)]). */
const CARD_CONNECTOR_STROKE = "rgba(228,111,5,0.22)";

const PRODUCT_SCROLL_CARDS = [
  {
    corner: "top-left",
    Icon: Droplets,
    title: "Hidratación consciente",
    subtitle: "Rutina que nutre",
    body:
      "Aceite corporal multifuncional pensado para acompañarte cada día, con sensación ligera y acabado sedoso.",
  },
  {
    corner: "top-right",
    Icon: Leaf,
    title: "Origen natural",
    subtitle: "Sin compromisos",
    body:
      "Fórmula elaborada con aceites naturales, sin aceites minerales y sin pruebas en animales.",
  },
  {
    corner: "bottom-right",
    Icon: Package,
    title: "Un solo producto",
    subtitle: "Muchos usos",
    body:
      "Cuerpo, cutículas o zonas resecas: un formato de 125 ml práctico para llevar contigo.",
  },
  {
    corner: "bottom-left",
    Icon: MapPin,
    title: "Hecho en Colombia",
    subtitle: "Marca con propósito",
    body:
      "K2Log es orgullo colombiano, con la calidez y coherencia del manual de marca en cada detalle.",
  },
];

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

/** Aproxima p al nodo 0 / 0.25 / … si está casi encima (ruido de subpíxeles). */
function snapProgressToGrid(p) {
  p = clamp01(p);
  for (const d of DISCRETE_P) {
    if (Math.abs(p - d) < GRID_SNAP_EPS) return d;
  }
  return p;
}

function nextDiscretePUp(p) {
  for (let i = 0; i < DISCRETE_P.length; i++) {
    if (DISCRETE_P[i] > p + 1e-6) return DISCRETE_P[i];
  }
  return 1;
}

function nextDiscretePDown(p) {
  for (let i = DISCRETE_P.length - 1; i >= 0; i--) {
    if (DISCRETE_P[i] < p - 1e-6) return DISCRETE_P[i];
  }
  return 0;
}

function smoothstep01(u) {
  u = clamp01(u);
  return u * u * (3 - 2 * u);
}

function cardScrollOpacity(p, index, reduceMotion) {
  p = clamp01(p);
  const start = CARD_REVEAL_STARTS[index] ?? 0;
  const w = CARD_REVEAL_WIDTH;
  if (p < start) return 0;
  if (p >= start + w) return 1;
  const t = (p - start) / w;
  return reduceMotion ? (t >= 0.5 ? 1 : 0) : smoothstep01(t);
}

/**
 * Posición sobre la caja del PNG (object-contain); orden = tarjetas.
 * Vista frontal: los dos superiores van en las esquinas del cuerpo del frasco,
 * justo debajo de la tapa (hombros), no sobre el tapón.
 * Si tu PNG tiene mucho margen transparente o recorte distinto, afinar % aquí.
 */
const BOTTLE_HOTSPOT_CORNER_POS = [
  "left-[41%] top-[37%] -translate-x-1/2 -translate-y-1/2",
  "right-[41%] top-[37%] translate-x-1/2 -translate-y-1/2",
  "right-[45%] bottom-[10%] translate-x-1/2 translate-y-1/2",
  "left-[45%] bottom-[10%] -translate-x-1/2 translate-y-1/2",
];

function BottleCornerHotspots({ opacities, reduceMotion, hotspotAnchorRefs }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[27]"
      aria-hidden
    >
      {BOTTLE_HOTSPOT_CORNER_POS.map((pos, i) => {
        const o = opacities[i] ?? 0;
        const anchorRef = hotspotAnchorRefs?.[i];
        return (
          <div
            key={i}
            className={`absolute flex size-[clamp(2.5rem,6vmin,3.25rem)] items-center justify-center ${pos}`}
            style={{ opacity: o }}
          >
            {!reduceMotion && (
              <>
                <span
                  className="k2-bottle-pulse-ring absolute inset-0 rounded-full border-2 border-k2-orange/50 bg-k2-orange/10"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="k2-bottle-pulse-ring absolute inset-0 rounded-full border border-k2-orange/35"
                  style={{ animationDelay: "1.05s" }}
                />
              </>
            )}
            <span
              ref={anchorRef}
              className="relative z-[2] size-[clamp(8px,1.55vmin,12px)] rounded-full bg-k2-orange shadow-[0_0_0_2px_rgba(255,255,255,0.92),0_2px_10px_rgba(228,111,5,0.42)]"
            />
          </div>
        );
      })}
    </div>
  );
}

function opacitiesFromVisualVf(vf) {
  vf = Math.min(4, Math.max(0, vf));
  const a = Math.floor(vf);
  const b = Math.min(4, a + 1);
  const tRaw = vf - a;
  const ia = FACE_BY_STEP[a];
  const ib = FACE_BY_STEP[b];
  const op = [0, 0, 0, 0];
  if (ia === ib) {
    op[ia] = 1;
    return op;
  }

  const w = Math.min(0.45, Math.max(0.04, CROSSFADE_FRACTION));
  let blend;
  if (tRaw <= 1 - w) {
    blend = 0;
  } else {
    const u = (tRaw - (1 - w)) / w;
    blend = smoothstep01(u);
  }
  op[ia] = 1 - blend;
  op[ib] = blend;
  return op;
}

function normalizeWheelDeltaY(e) {
  if (e.deltaMode === 1) return e.deltaY * 16;
  if (e.deltaMode === 2) {
    return e.deltaY * (typeof window !== "undefined" ? window.innerHeight : 600);
  }
  return e.deltaY;
}

export function BottleScroll360({
  id = "producto",
  pinScrollVh = PIN_SCROLL_VH,
}) {
  const outerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [visualVf, setVisualVf] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** La sección está en pin (centrada en viewport): la 1.ª tarjeta se muestra de inmediato. */
  const [productPinned, setProductPinned] = useState(false);

  const progressRef = useRef(0);
  const visualVfRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const animRafRef = useRef(0);
  /** Escena para SVG de conectores punto → borde tarjeta (mismo rect que cards + frasco). */
  const connectorSceneRef = useRef(null);
  const hotspotAnchorRef0 = useRef(null);
  const hotspotAnchorRef1 = useRef(null);
  const hotspotAnchorRef2 = useRef(null);
  const hotspotAnchorRef3 = useRef(null);
  const hotspotAnchorRefs = [
    hotspotAnchorRef0,
    hotspotAnchorRef1,
    hotspotAnchorRef2,
    hotspotAnchorRef3,
  ];
  const cardFrameRef0 = useRef(null);
  const cardFrameRef1 = useRef(null);
  const cardFrameRef2 = useRef(null);
  const cardFrameRef3 = useRef(null);
  const cardFrameRefs = [cardFrameRef0, cardFrameRef1, cardFrameRef2, cardFrameRef3];
  /** [i]: segmento hotspot i → borde tarjeta i (marco glass). */
  const [cardConnectorLines, setCardConnectorLines] = useState(() => [
    null,
    null,
    null,
    null,
  ]);

  reduceMotionRef.current = reduceMotion;

  useEffect(() => {
    visualVfRef.current = visualVf;
  }, [visualVf]);

  const stopLerp = useCallback(() => {
    if (animRafRef.current) {
      cancelAnimationFrame(animRafRef.current);
      animRafRef.current = 0;
    }
  }, []);

  const runLerpFrame = useCallback(() => {
    const t = progressRef.current * 4;
    let v = visualVfRef.current;

    if (reduceMotionRef.current) {
      if (Math.abs(v - t) > 1e-6) {
        visualVfRef.current = t;
        setVisualVf(t);
      }
      animRafRef.current = 0;
      return;
    }

    v += (t - v) * LERP;
    if (Math.abs(t - v) < SNAP_EPS) v = t;

    if (Math.abs(v - visualVfRef.current) > 1e-6) {
      visualVfRef.current = v;
      setVisualVf(v);
    }

    if (Math.abs(t - v) > SNAP_EPS) {
      animRafRef.current = requestAnimationFrame(runLerpFrame);
    } else {
      animRafRef.current = 0;
    }
  }, []);

  const kickLerp = useCallback(() => {
    if (reduceMotionRef.current) {
      stopLerp();
      const t = progressRef.current * 4;
      visualVfRef.current = t;
      setVisualVf(t);
      return;
    }

    const t = progressRef.current * 4;
    const v = visualVfRef.current;

    if (Math.abs(t - v) <= SNAP_EPS) {
      stopLerp();
      if (Math.abs(visualVfRef.current - t) > 1e-6) {
        visualVfRef.current = t;
        setVisualVf(t);
      }
      return;
    }

    if (!animRafRef.current) {
      animRafRef.current = requestAnimationFrame(runLerpFrame);
    }
  }, [runLerpFrame, stopLerp]);

  useEffect(() => {
    if (reduceMotion) {
      stopLerp();
      const t = progressRef.current * 4;
      visualVfRef.current = t;
      setVisualVf(t);
    } else {
      kickLerp();
    }
  }, [reduceMotion, kickLerp, stopLerp]);

  const updateScrollProgress = useCallback(() => {
    const section = outerRef.current;
    if (!section) return;
    const vh = window.innerHeight;
    const scrollRange = section.offsetHeight - vh;
    const rect = section.getBoundingClientRect();

    if (scrollRange <= 0) {
      progressRef.current = 1;
      setProgress(1);
      setProductPinned(true);
      kickLerp();
      return;
    }

    if (rect.top > 0) {
      progressRef.current = 0;
      setProgress(0);
      setProductPinned(false);
      kickLerp();
      return;
    }

    setProductPinned(true);
    const pastPin = -rect.top;
    const p = Math.min(1, Math.max(0, pastPin / scrollRange));
    progressRef.current = p;
    setProgress(p);
    kickLerp();
  }, [kickLerp]);

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

  useEffect(() => () => stopLerp(), [stopLerp]);

  useEffect(() => {
    const onWheel = (e) => {
      const section = outerRef.current;
      if (!section) return;

      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - vh;

      if (scrollRange <= 0) return;

      const pinned = rect.top <= 1 && rect.bottom >= vh - 1;
      if (!pinned) {
        wheelAccumRef.current = 0;
        return;
      }

      const dy = normalizeWheelDeltaY(e);
      let acc = wheelAccumRef.current;

      if (dy !== 0 && acc !== 0 && Math.sign(dy) !== Math.sign(acc)) {
        acc = dy;
      } else {
        acc += dy;
      }

      acc = Math.max(-WHEEL_ACCUM_CAP, Math.min(WHEEL_ACCUM_CAP, acc));
      wheelAccumRef.current = acc;

      if (Math.abs(wheelAccumRef.current) < WHEEL_THRESHOLD) return;

      const sign = Math.sign(wheelAccumRef.current);
      wheelAccumRef.current = 0;

      const p = snapProgressToGrid(clamp01(progressRef.current));
      const nextP = sign > 0 ? nextDiscretePUp(p) : nextDiscretePDown(p);

      if (Math.abs(nextP - p) < 1e-6) {
        return;
      }

      const deltaY = (nextP - p) * scrollRange;
      if (Math.abs(deltaY) < 0.5) {
        return;
      }

      window.scrollBy({ top: deltaY, left: 0, behavior: "auto" });
      e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const opacities = reduceMotion
    ? (() => {
        const p = clamp01(progress);
        const step = p >= 1 ? 4 : Math.min(4, Math.floor(p * 5));
        const o = [0, 0, 0, 0];
        o[FACE_BY_STEP[step]] = 1;
        return o;
      })()
    : opacitiesFromVisualVf(visualVf);

  const cardOpacities = PRODUCT_SCROLL_CARDS.map((_, i) =>
    productPinned ? cardScrollOpacity(progress, i, reduceMotion) : 0,
  );

  const updateCardConnectorLines = useCallback(() => {
    const scene = connectorSceneRef.current;
    if (!scene) {
      setCardConnectorLines([null, null, null, null]);
      return;
    }
    const sr = scene.getBoundingClientRect();
    const next = [null, null, null, null];
    for (let i = 0; i < 4; i++) {
      const hot = hotspotAnchorRefs[i]?.current;
      const card = cardFrameRefs[i]?.current;
      if (!hot || !card) continue;
      const hr = hot.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      let x1 = hr.left + hr.width / 2 - sr.left;
      let y1 = hr.top + hr.height / 2 - sr.top;
      /** Tarjetas izquierda (sup./inf.): borde derecho hacia el frasco; derechas: borde izquierdo. */
      const facesWest = PRODUCT_SCROLL_CARDS[i]?.corner === "top-left" || PRODUCT_SCROLL_CARDS[i]?.corner === "bottom-left";
      let x2 = facesWest ? cr.right - sr.left : cr.left - sr.left;
      let y2 = cr.top + cr.height / 2 - sr.top;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len > 1e-6) {
        const insetStart = Math.min(10, len * 0.045);
        x1 += (dx / len) * insetStart;
        y1 += (dy / len) * insetStart;
      }
      next[i] = { x1, y1, x2, y2 };
    }
    setCardConnectorLines(next);
  }, []);

  useLayoutEffect(() => {
    updateCardConnectorLines();
    const scene = connectorSceneRef.current;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateCardConnectorLines())
        : null;
    if (scene && ro) ro.observe(scene);
    window.addEventListener("resize", updateCardConnectorLines);
    window.addEventListener("scroll", updateCardConnectorLines, { passive: true });
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateCardConnectorLines);
      window.removeEventListener("scroll", updateCardConnectorLines);
    };
  }, [progress, productPinned, visualVf, updateCardConnectorLines]);

  /**
   * Tarjetas superiores: debajo del titular. lg (1024px+): fila superior algo más arriba — tarjetas lg más altas.
   * Inferiores: lg con hueco mayor en min() anti-solape; md/xl/2xl sin cambiar respecto al ajuste previo.
   */
  const cardInsetY =
    "[top:calc(clamp(3.25rem,12vh,6rem)_+_clamp(2.5rem,7vh,3.75rem)_+_1.85rem)] sm:[top:calc(clamp(3.75rem,13vh,6.75rem)_+_clamp(2.5rem,6.5vh,3.5rem)_+_1.85rem)] md:[top:calc(clamp(4.25rem,14vh,7.25rem)_+_clamp(2.35rem,5.5vh,3.35rem)_+_1rem)] lg:[top:calc(clamp(4.25rem,14vh,7.25rem)_+_clamp(2.35rem,5vh,3.25rem)_+_0.55rem)]";
  /** Base desde abajo (móvil: igual que antes). md/xl/2xl: sin cambio; lg: más margen entre filas en 1024px. */
  const cardInsetBottomY =
    "[bottom:calc(clamp(3.25rem,12vh,6rem)_+_clamp(2.5rem,7vh,3.75rem)_+_0.35rem_-_0.7rem)] sm:[bottom:calc(clamp(3.75rem,13vh,6.75rem)_+_clamp(2.5rem,6.5vh,3.5rem)_+_0.35rem_-_0.65rem)] md:[bottom:max(0.5rem,min(calc(clamp(4.25rem,14vh,7.25rem)_+_clamp(2.35rem,5.5vh,3.35rem)_+_0.35rem),calc(100vh_-_clamp(4.25rem,14vh,7.25rem)_-_clamp(2.35rem,5.5vh,3.35rem)_-_1.5rem_-_10.75rem_-_10.75rem_-_4rem)))] lg:[bottom:max(0.5rem,min(calc(clamp(4.25rem,14vh,7.25rem)_+_clamp(2.35rem,5vh,3.25rem)_+_0.35rem),calc(100vh_-_clamp(4.25rem,14vh,7.25rem)_-_clamp(2.35rem,5vh,3.25rem)_-_1.5rem_-_13rem_-_13rem_-_6.5rem)))] xl:[bottom:max(0.5rem,min(calc(clamp(4.25rem,14vh,7.25rem)_+_clamp(2.35rem,5vh,3.25rem)_+_0.35rem),calc(100vh_-_clamp(4.25rem,14vh,7.25rem)_-_clamp(2.35rem,5vh,3.25rem)_-_1.5rem_-_14rem_-_14rem_-_4rem)))] 2xl:[bottom:max(0.5rem,min(calc(clamp(4.25rem,14vh,7.25rem)_+_clamp(2.35rem,5vh,3.25rem)_+_0.35rem),calc(100vh_-_clamp(4.25rem,14vh,7.25rem)_-_clamp(2.35rem,5vh,3.25rem)_-_1.5rem_-_14.75rem_-_14.75rem_-_4rem)))]";

  const cornerPositionClass = {
    "top-left": `left-[clamp(2px,1.15vw,14px)] ${cardInsetY} sm:left-[clamp(12px,3vw,28px)] md:left-[clamp(16px,3.5vw,40px)] lg:left-[clamp(2.25rem,5vw,4rem)] xl:left-[clamp(2.85rem,5.25vw,4.75rem)] 2xl:left-[clamp(3.35rem,5.25vw,5.25rem)]`,
    "top-right": `right-[clamp(2px,1.15vw,14px)] ${cardInsetY} sm:right-[clamp(12px,3vw,28px)] md:right-[clamp(16px,3.5vw,40px)] lg:right-[clamp(2.25rem,5vw,4rem)] xl:right-[clamp(2.85rem,5.25vw,4.75rem)] 2xl:right-[clamp(3.35rem,5.25vw,5.25rem)]`,
    "bottom-right": `right-[clamp(2px,1.15vw,14px)] ${cardInsetBottomY} sm:right-[clamp(12px,3vw,28px)] md:right-[clamp(16px,3.5vw,40px)] lg:right-[clamp(2.25rem,5vw,4rem)] xl:right-[clamp(2.85rem,5.25vw,4.75rem)] 2xl:right-[clamp(3.35rem,5.25vw,5.25rem)]`,
    "bottom-left": `left-[clamp(2px,1.15vw,14px)] ${cardInsetBottomY} sm:left-[clamp(12px,3vw,28px)] md:left-[clamp(16px,3.5vw,40px)] lg:left-[clamp(2.25rem,5vw,4rem)] xl:left-[clamp(2.85rem,5.25vw,4.75rem)] 2xl:left-[clamp(3.35rem,5.25vw,5.25rem)]`,
  };

  /** Caja contenido; el borde visible es la capa glass (igual que BeforeAfterScrollSlider). */
  const cardBoxClass =
    "box-border flex w-[min(6.85rem,calc(50vw-1.5rem))] flex-none flex-col overflow-visible rounded-[clamp(10px,2vw,14px)] sm:w-[8.35rem] md:w-[10.75rem] lg:w-[14.25rem] xl:w-[15.75rem] 2xl:w-[17rem] " +
    "h-[8.1rem] sm:h-[9.1rem] md:h-[10.75rem] lg:h-[13rem] xl:h-[14rem] 2xl:h-[14.75rem]";

  return (
    <section
      ref={outerRef}
      id={id}
      className="relative z-[40] w-full bg-k2-peach"
      style={{ height: `${pinScrollVh * 100}vh` }}
      aria-label="Producto — aceite corporal K2Log, vistas del frasco al desplazarse"
    >
      <p className="sr-only pointer-events-none absolute left-4 top-4 z-10">
        Frasco de aceite corporal multifuncional K2Log. Cada gesto de desplazamiento
        vertical avanza o retrocede entre el frente, el lateral derecho, el reverso,
        el lateral izquierdo y de nuevo el frente del envase. En las esquinas de la
        pantalla aparecen tarjetas con información del producto a medida que avanzas
        por esta sección, con la misma transición suave entre cada una.
      </p>

      <div className="sticky top-0 isolate flex h-dvh min-h-dvh w-full items-stretch justify-center px-4 sm:px-6 lg:px-8">
        <div
          ref={connectorSceneRef}
          className="relative h-full min-h-0 w-full max-w-[min(100vw,1400px)]"
        >
          {PRODUCT_SCROLL_CARDS.map((card, i) => {
            const o = productPinned
              ? cardScrollOpacity(progress, i, reduceMotion)
              : 0;
            const lift = reduceMotion ? 0 : (1 - o) * 12;
            const Icon = card.Icon;
            return (
              <article
                key={card.corner}
                className={`absolute z-10 ${cardBoxClass} ${cornerPositionClass[card.corner]}`}
                style={{
                  opacity: o,
                  transform: `translateY(${lift}px)`,
                  pointerEvents: o < 0.08 ? "none" : "auto",
                }}
                aria-hidden={o < 0.12}
              >
                <div className="relative flex h-full min-h-0 flex-col">
                  <div
                    ref={cardFrameRefs[i]}
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
                  <div className="relative z-[1] flex h-full min-h-0 flex-col px-1 py-1 text-left sm:px-1.5 sm:py-1.5 md:px-2 md:py-2 lg:px-2.5 lg:py-2.5 xl:px-3 xl:py-3">
                    <div className="mb-1 flex shrink-0 justify-start sm:mb-2 lg:mb-2.5">
                      <span
                        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-k2-peach/85 bg-k2-orange text-k2-white shadow-[0_2px_10px_rgba(228,111,5,0.35)] sm:size-7 sm:border-2 md:size-8 lg:size-10 lg:border-[2.5px] xl:size-11"
                        aria-hidden
                      >
                        <Icon
                          className="size-2.5 text-k2-white sm:size-3.5 md:size-4 lg:size-[1.15rem] xl:size-5"
                          strokeWidth={1.85}
                          aria-hidden
                        />
                      </span>
                    </div>
                    <p className="mb-0.5 line-clamp-2 font-sans text-[0.4rem] font-semibold uppercase leading-tight tracking-[0.2em] text-k2-orange sm:mb-1.5 sm:text-[0.5rem] sm:tracking-[0.28em] md:text-[0.5625rem] md:tracking-[0.3em] lg:mb-2 lg:text-[0.625rem] lg:tracking-[0.32em] xl:text-[0.6875rem]">
                      {card.subtitle}
                    </p>
                    <h3 className="mb-0.5 line-clamp-2 min-h-0 font-display text-[0.6rem] font-semibold leading-[1.1] tracking-[0.01em] text-[#221610] sm:mb-1.5 sm:text-[0.75rem] md:text-[0.8125rem] lg:mb-2 lg:line-clamp-3 lg:text-[0.9375rem] lg:leading-[1.15] xl:text-[1.0625rem] 2xl:text-[1.125rem]">
                      {card.title}
                    </h3>
                    <p className="line-clamp-4 font-sans text-[0.46rem] font-light leading-snug text-[rgba(34,22,16,0.78)] sm:text-[0.5625rem] sm:leading-[1.5] md:text-[0.6rem] lg:line-clamp-5 lg:text-[0.6875rem] lg:leading-[1.55] xl:text-[0.75rem] 2xl:text-[0.8125rem]">
                      {card.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}

          {cardConnectorLines.some(Boolean) && (
            <svg
              className="pointer-events-none absolute inset-0 z-[21] h-full w-full overflow-visible"
              aria-hidden
            >
              {cardConnectorLines.map((seg, i) =>
                seg ? (
                  <line
                    key={i}
                    x1={seg.x1}
                    y1={seg.y1}
                    x2={seg.x2}
                    y2={seg.y2}
                    stroke={CARD_CONNECTOR_STROKE}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    style={{
                      opacity: cardOpacities[i] ?? 0,
                    }}
                  />
                ) : null,
              )}
            </svg>
          )}

          <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[clamp(3.25rem,12vh,6rem)] md:justify-center sm:pt-[clamp(3.75rem,13vh,6.75rem)] md:pt-[clamp(4.25rem,14vh,7.25rem)]">
            <div className="pointer-events-none relative z-[25] mx-auto mb-0 flex w-full max-w-[min(100vw,1400px)] shrink-0 flex-col items-center px-2 text-center sm:mb-0.5 md:mb-1">
              <span className="mb-[5px] block font-sans text-[10px] font-medium uppercase tracking-[0.44em] text-k2-orange">
                Aceite Corporal · 125 ml
              </span>
              <h2 className="max-w-[min(20rem,92vw)] font-display text-[clamp(22px,3vw,40px)] font-normal leading-[1.15] text-[#221610] sm:max-w-none sm:whitespace-nowrap">
                La <em className="italic text-k2-orange">fórmula</em> del cuidado
              </h2>
            </div>
            <div
              className="relative flex w-full max-w-[min(100vw,1400px)] min-h-0 flex-1 shrink-0 items-center justify-center max-md:min-h-[52dvh] max-md:py-2 -mt-2 sm:-mt-3 md:-mt-4 md:min-h-0 md:flex-none"
              aria-hidden
            >
              <div className="relative mx-auto w-fit max-w-[min(98vw,1120px)] md:max-w-[min(94vw,1280px)]">
                {VIEWS.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={1920}
                    height={2880}
                    sizes="(max-width: 640px) 100vw, 1280px"
                    priority={i === 0}
                    className={`${bottleImgClass} ${
                      i === 0
                        ? "relative"
                        : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    }`}
                    style={{
                      opacity: opacities[i],
                      pointerEvents: "none",
                    }}
                  />
                ))}
                <BottleCornerHotspots
                  opacities={cardOpacities}
                  reduceMotion={reduceMotion}
                  hotspotAnchorRefs={hotspotAnchorRefs}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
