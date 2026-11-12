import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "md" | "lg";

const base =
  "cut cut-sm inline-flex items-center justify-center gap-2 font-display font-semibold whitespace-nowrap " +
  "transition-[filter,background-color] duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-volt text-ink-950 hover:brightness-110",
  ghost: "bg-ink-700 text-fg hover:bg-line",
  danger: "bg-danger text-ink-950 hover:brightness-110",
};

const sizes: Record<Size, string> = {
  md: "min-h-[44px] px-5 text-[15px]",
  lg: "min-h-[52px] px-7 text-[17px]",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type LinkProps = CommonProps & { href: string };
type NativeProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function buttonClass(variant: Variant = "primary", size: Size = "md", className = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

/** Renders a link when given `href`, otherwise a button. */
export default function Button(props: LinkProps | NativeProps) {
  if ("href" in props) {
    const { href, variant, size, className, children } = props;
    return (
      <Link href={href} className={buttonClass(variant, size, className)}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
