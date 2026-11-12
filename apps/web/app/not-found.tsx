import CenterCanvas from "@/canvas/Center";
import Button from "@/components/ui/Button";
import { strings } from "@/lib/strings";

export default function NotFound() {
  return (
    <section className="max-w-page mx-auto px-4 sm:px-6 py-16 flex flex-col items-start gap-5">
      <CenterCanvas className="w-full max-w-[420px] h-[240px]" />
      <p className="font-display font-bold text-[120px] leading-none text-ink-700" aria-hidden="true">
        {strings.errors.notFoundCode}
      </p>
      <h1 className="text-[40px]">{strings.errors.notFoundTitle}</h1>
      <p className="text-muted max-w-[52ch]">{strings.errors.notFoundBody}</p>
      <Button href="/">{strings.errors.backHome}</Button>
    </section>
  );
}
