"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  Droplet,
  Home,
  Sparkles,
  UserPlus,
} from "lucide-react";

const ITEMS = [
  { id: "inicio", href: "#inicio", label: "Inicio", Icon: Home },
  {
    id: "antes-despues",
    href: "#antes-despues",
    label: "Antes y después",
    Icon: Columns2,
  },
  { id: "producto", href: "#producto", label: "Producto", Icon: Droplet },
  { id: "beneficios", href: "#beneficios", label: "Beneficios", Icon: Sparkles },
  { id: "afiliados", href: "#afiliados", label: "Afiliados", Icon: UserPlus },
];

export function CircularNav() {
  const [open, setOpen] = useState(true);

  return (
    <div className="pointer-events-none fixed left-0 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-start pl-3 sm:pl-4">
      <div className="pointer-events-auto flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-k2-white/12 text-k2-white shadow-lg shadow-black/20 backdrop-blur-md transition hover:bg-k2-orange hover:text-k2-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-white"
          aria-expanded={open}
          aria-controls="k2-section-nav"
          aria-label={open ? "Ocultar menú de secciones" : "Mostrar menú de secciones"}
        >
          {open ? (
            <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
          ) : (
            <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
          )}
        </button>

        <nav
          id="k2-section-nav"
          className={`flex flex-col gap-3 transition-all duration-700 ease-in-out ${
            open
              ? "max-h-[min(70vh,28rem)] translate-x-0 opacity-100"
              : "pointer-events-none max-h-0 -translate-x-4 opacity-0"
          }`}
          aria-hidden={!open}
          aria-label="Navegación por secciones"
        >
          {ITEMS.map(({ id, href, label, Icon }) => (
            <a
              key={id}
              href={href}
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-k2-white/12 text-k2-white shadow-md shadow-black/15 backdrop-blur-md transition hover:scale-105 hover:border-k2-orange hover:bg-k2-orange hover:text-k2-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k2-white"
              aria-label={label}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              <span
                className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded-md bg-k2-ink/92 px-2.5 py-1.5 font-sans text-xs font-medium text-k2-peach opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                role="tooltip"
              >
                {label}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
