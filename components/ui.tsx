import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

function buttonClasses(variant: ButtonVariant, size: ButtonSize, disabled: boolean | undefined, className?: string) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "bg-white text-foreground border border-border hover:bg-slate-50",
    ghost: "text-foreground hover:bg-slate-100",
    danger: "bg-danger text-white hover:bg-red-700",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
  };
  return cx(base, variants[variant], sizes[size], disabled && "opacity-50 pointer-events-none", className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClasses(variant, size, props.disabled, className)} {...props} />;
}

/** Renders as a single <a> styled like Button — use instead of wrapping <Button> in <Link>, which produces invalid (and hydration-unsafe) nested interactive elements. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  disabled,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant; size?: ButtonSize; disabled?: boolean; href: string }) {
  if (disabled) {
    return (
      <span className={buttonClasses(variant, size, true, className)} aria-disabled="true">
        {props.children}
      </span>
    );
  }
  return <Link href={href} className={buttonClasses(variant, size, false, className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldLabel({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx("mb-1.5 block text-sm font-medium text-foreground", className)} {...props} />;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("rounded-xl border border-border bg-surface shadow-sm", className)}>{children}</div>;
}

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "brand" | "success" | "warning" | "danger" | "info";
  children: ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-700",
    brand: "bg-brand-light text-brand-dark",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-cyan-100 text-cyan-700",
  };
  return (
    <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center">
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cx("animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-label="Loading">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function Alert({ tone = "info", children }: { tone?: "info" | "success" | "danger"; children: ReactNode }) {
  const tones: Record<string, string> = {
    info: "bg-brand-light text-brand-dark border-brand/20",
    success: "bg-green-50 text-green-800 border-green-200",
    danger: "bg-red-50 text-red-800 border-red-200",
  };
  return <div className={cx("rounded-lg border px-4 py-3 text-sm", tones[tone])} role="alert">{children}</div>;
}
