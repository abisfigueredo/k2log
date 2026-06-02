const WHATSAPP_NUMBER = "+57 301 651 5222";
const WHATSAPP_HREF = "https://wa.me/573016515222";
const EMAIL = "contacto@k2log.com";
const ARFM_WA_HREF = "https://wa.me/573205647828";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/k2log_/",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@K2Log_",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/K2log",
  },
];

function WhatsAppIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  Facebook: FacebookIcon,
};

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto w-full">
      <div className="relative -mt-3 bg-k2-terracotta pt-[calc(0.5rem*0.98)] text-k2-white sm:-mt-4 md:-mt-6">
        <div className="mx-auto w-full max-w-6xl px-[calc(1.25rem*0.98)] pb-[calc(1.75rem*0.98)] pt-[calc(1rem*0.98)] sm:px-[calc(2rem*0.98)] sm:pb-[calc(2.25rem*0.98)] sm:pt-[calc(1.5rem*0.98)]">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <p className="font-k2-brand-name font-display text-2xl tracking-tight text-k2-white sm:text-3xl">
                K2LOG
              </p>
              <p className="mt-1 font-sans text-[0.65rem] font-light uppercase tracking-[0.35em] text-white/95">
                Key to Log
              </p>
              <p className="mt-4 text-sm font-light leading-relaxed text-white/95">
                La clave para un cuidado consciente de la piel. Belleza natural,
                formulación honesta.
              </p>
            </div>

            <div className="md:text-right">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.28em] text-k2-peach">
                Contáctanos
              </h2>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-3 block text-sm font-medium text-white/95 transition hover:text-k2-white"
              >
                {EMAIL}
              </a>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2.5 text-sm font-medium text-white/95 transition hover:text-k2-white md:justify-end"
              >
                <WhatsAppIcon className="size-5 shrink-0" />
                <span>{WHATSAPP_NUMBER}</span>
              </a>
            </div>
          </div>

          <div className="mt-[calc(3rem*0.98)] border-t border-white/70 pt-[calc(2rem*0.98)]">
            <div className="flex flex-col gap-5 text-center text-xs font-light text-white/90 sm:grid sm:grid-cols-3 sm:items-center sm:gap-3 sm:text-left">
              <p className="sm:justify-self-start">
                © {new Date().getFullYear()}{" "}
                <span className="font-k2-brand-name">K2Log</span>. Todos los derechos
                reservados.
              </p>

              <nav
                className="flex items-center justify-center gap-7 sm:justify-self-center"
                aria-label="Redes sociales"
              >
                {SOCIAL_LINKS.map(({ label, href }) => {
                  const Icon = SOCIAL_ICONS[label];
                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center text-k2-white transition hover:text-k2-peach"
                      aria-label={label}
                      title={label}
                    >
                      <Icon className="size-6" />
                    </a>
                  );
                })}
              </nav>

              <a
                href={ARFM_WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-sans text-xs font-medium text-white/95 transition hover:text-k2-white sm:justify-self-end sm:text-right"
              >
                <WhatsAppIcon className="size-4 shrink-0" />
                <span>Diseñado por ARFM WebApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
