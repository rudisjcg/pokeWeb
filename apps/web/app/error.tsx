"use client";

import { strings } from "@/lib/strings";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pt-32 pb-20 flex flex-col items-center gap-4 text-center" role="alert">
      <h1 className="text-[24px] font-bold">{strings.errors.loadFailedTitle}</h1>
      <p>{strings.errors.loadFailedBody}</p>
      <button type="button" className="btn" onClick={reset}>
        {strings.errors.retry}
      </button>
    </div>
  );
}
