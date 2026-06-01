"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

const PRICE = "$ 89.900";
const RATING = 4.9;

export function QuickBuyCard({ className = "" }) {
  return (
    <div
      className={`pointer-events-auto w-[min(100vw-2rem,18rem)] rounded-2xl border border-white/35 bg-k2-white/12 p-3 shadow-2xl shadow-black/25 backdrop-blur-md sm:w-[19rem] ${className}`}
    >
      <div className="grid grid-cols-[minmax(4.25rem,4.5rem)_minmax(0,1fr)] gap-2.5 items-stretch">
        <div className="relative min-h-0 min-w-0 overflow-hidden rounded-lg bg-k2-peach/30">
          <Image
            src="/images/aceite-k2log.png"
            alt="Aceite Corporal K2Log 125 ml"
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 96px, 112px"
            priority
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-col">
          <p className="font-k2-brand-name font-display text-sm font-semibold leading-snug text-k2-white sm:text-base">
            Aceite Corporal K2Log
          </p>
          <p className="mt-0.5 font-sans text-[0.6rem] font-light uppercase tracking-[0.2em] text-white/90">
            Multifuncional · 125 ml
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="font-sans text-base font-semibold text-k2-white">
              {PRICE}
            </span>
            <span
              className="inline-flex items-center gap-0.5 rounded-full bg-black/20 px-2 py-0.5 font-sans text-xs font-medium text-k2-peach"
              title={`${RATING} de 5`}
            >
              <Star
                className="h-3.5 w-3.5 fill-amber-300 text-amber-300"
                aria-hidden
              />
              {RATING}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1">
            <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 font-sans text-[0.65rem] font-medium uppercase tracking-wide text-white/95">
              Hidratante
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 font-sans text-[0.65rem] font-medium uppercase tracking-wide text-white/95">
              Natural
            </span>
          </div>

          <button
            type="button"
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-k2-terracotta py-2 font-sans text-xs font-semibold uppercase tracking-wider text-k2-white shadow-lg shadow-k2-terracotta/40 transition hover:bg-k2-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-white sm:text-sm"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
