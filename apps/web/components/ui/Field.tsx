import { useId, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  label: string;
  error?: string | null;
};

/** Labelled text input with an optional error message announced to screen readers. */
export default function Field({ label, error, ...input }: Props) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] font-medium text-muted">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-[48px] px-4 bg-ink-950 border text-fg placeholder:text-muted/60 outline-offset-0 ${
          error ? "border-danger" : "border-line"
        }`}
        {...input}
      />
      {error && (
        <p id={errorId} role="alert" className="text-danger text-[14px]">
          {error}
        </p>
      )}
    </div>
  );
}
