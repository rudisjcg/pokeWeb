import HeroCanvas from "@/canvas/HeroCanvas";
import { strings } from "@/lib/strings";
import HeroActions from "./HeroActions";

export default function Hero() {
  return (
    <section
      className="hero-slash relative overflow-hidden border-b border-line min-h-[calc(100svh-var(--nav-height))] flex items-center"
    >
      <div className="max-w-page mx-auto w-full px-4 sm:px-6 py-10 grid items-center gap-4 md:grid-cols-[minmax(0,11fr)_minmax(0,10fr)]">
        <div className="relative z-10">
          <h1 className="text-[clamp(44px,7.4vw,92px)]">{strings.home.title}</h1>
          <p className="text-muted text-[18px] leading-relaxed mt-6 max-w-[46ch]">{strings.home.subtitle}</p>
          <HeroActions />
        </div>
        <div className="h-[300px] md:h-[min(68svh,620px)]">
          <HeroCanvas />
        </div>
      </div>
    </section>
  );
}
