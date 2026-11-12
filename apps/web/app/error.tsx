"use client";

import Button from "@/components/ui/Button";
import { strings } from "@/lib/strings";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="max-w-page mx-auto px-4 sm:px-6 py-24 flex flex-col items-start gap-5" role="alert">
      <h1 className="text-[40px]">{strings.errors.loadFailedTitle}</h1>
      <p className="text-muted max-w-[52ch]">{strings.errors.loadFailedBody}</p>
      <Button onClick={reset}>{strings.errors.retry}</Button>
    </section>
  );
}
