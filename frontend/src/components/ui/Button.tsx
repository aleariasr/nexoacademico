import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "glass" | "ghost";
type ButtonSize = "sm" | "md" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "nexo-pressable inline-flex items-center justify-center gap-2 font-semibold outline-none disabled:pointer-events-none disabled:opacity-45";

const variants = {
  primary: "nexo-primary text-white",
  glass: "nexo-control text-slate-800",
  ghost: "text-slate-700 hover:bg-white/35",
};

const sizes = {
  sm: "h-9 rounded-full px-3 text-sm",
  md: "h-11 rounded-full px-4 text-sm",
  icon: "h-11 w-11 rounded-full",
};

export default function Button({
  className = "",
  variant = "glass",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}