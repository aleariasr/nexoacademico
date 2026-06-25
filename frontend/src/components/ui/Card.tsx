import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-[32px]
        border
        border-white/55
        bg-white/45
        p-6
        shadow-[0_18px_50px_rgba(15,23,42,0.07)]
        backdrop-blur-[24px]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}