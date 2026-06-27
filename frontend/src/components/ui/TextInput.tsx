import type { InputHTMLAttributes, ReactNode } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

export default function TextInput({
  icon,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className="relative">
      {icon ? (
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      ) : null}

      <input
        className={`
          h-11 w-full rounded-[var(--radius-md)]
          border border-white/60 bg-white/55
          ${icon ? "pl-11" : "pl-4"} pr-4
          text-sm text-slate-950 outline-none
          transition
          placeholder:text-slate-400
          focus:bg-white/80
          focus:ring-2 focus:ring-[rgba(10,132,255,0.18)]
          ${className}
        `}
        {...props}
      />
    </div>
  );
}