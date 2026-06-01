import { AffiliatesSection } from "../components/AffiliatesSection";
import { BeforeAfterScrollSlider } from "../components/BeforeAfterScrollSlider";
import { BenefitsSection } from "../components/BenefitsSection";
import { BottleScroll360 } from "../components/BottleScroll360";
import { HeroBanner } from "../components/HeroBanner";
import { OrganicWave } from "../components/OrganicWave";

export default function Home() {
  return (
    <>
      <HeroBanner />

      <BeforeAfterScrollSlider />

      {/* Melocotón = fondo de #producto; solapa el borde inferior del antes/después (altura del SVG) */}
      <OrganicWave
        fill="#ffe5cc"
        className="pointer-events-none relative z-[55] -mt-10 sm:-mt-14 md:-mt-16"
      />

      <BottleScroll360 />

      {/* Franja peach + margen inferior: aparta visualmente la onda del contenido sticky del bote */}
      <OrganicWave
        tall
        fill="#ffe5cc"
        className="pointer-events-none relative z-30 mt-8 w-full shrink-0 rotate-180 sm:mt-10 md:mt-14"
      />

      <BenefitsSection />

      {/* Naranja (Benefits): transición hacia Afiliados */}
      <OrganicWave
        tall
        fill="#dd5116"
        className="pointer-events-none relative z-30 mt-0 w-full shrink-0 -translate-y-[2.5vh] rotate-180 sm:mt-1 md:mt-2 lg:mt-3"
      />

      <AffiliatesSection />

      {/* Terracota: transición desde Afiliados hacia Footer */}
      <OrganicWave
        fill="#dd5116"
        className="pointer-events-none relative z-20 -mb-px w-full shrink-0"
      />
    </>
  );
}
