"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
};

/** Centered modal built on the native <dialog>: focus trap, Escape and backdrop click close it. */
export default function Modal({ open, onClose, label, className = "", children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={`m-auto p-0 bg-transparent text-white backdrop:bg-black/50 ${className}`}
    >
      {open && children}
    </dialog>
  );
}
