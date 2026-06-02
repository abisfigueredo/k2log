/**
 * Onda entre secciones — la curva orgánica queda en la parte SUPERIOR del bloque SVG;
 * el borde inferior del relleno es recto (`rotate-180` invierte: ondas abajo).
 * @param {{ tall?: boolean }} props — onda más alta (mejor lectura del perfil).
 */
export function OrganicWave({ className = "", fill = "#dd5116", tall = false }) {
  const svgHeight =
    tall === true
      ? "h-14 w-[calc(100%+1px)] sm:h-20 md:h-24"
      : "h-10 w-[calc(100%+1px)] sm:h-14 md:h-16";
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden leading-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`relative block ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          fill={fill}
          d="M0,40 C240,90 480,0 720,45 C960,90 1200,10 1440,50 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}
