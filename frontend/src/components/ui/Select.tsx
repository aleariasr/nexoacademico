import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`
        h-11 rounded-[var(--radius-md)]
        border border-white/60 bg-white/55
        px-4 text-sm text-slate-950 outline-none
        transition
        focus:bg-white/80
        focus:ring-2 focus:ring-[rgba(10,132,255,0.18)]
        ${className}
      `}
      {...props}
    />
  );
}