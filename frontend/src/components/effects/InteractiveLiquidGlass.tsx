"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type InteractiveLiquidGlassProps = {
  children: ReactNode;
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
  interactive?: boolean;
};

export default function InteractiveLiquidGlass({
  children,
  className = "",
  intensity = "medium",
  interactive = true,
}: InteractiveLiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!interactive || !containerRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive]);

  const intensityMap = {
    subtle: { blur: 20, saturate: 150, opacity: 0.7 },
    medium: { blur: 24, saturate: 180, opacity: 0.8 },
    strong: { blur: 28, saturate: 220, opacity: 0.9 },
  };

  const { blur, saturate, opacity } = intensityMap[intensity];

  return (
    <div
      ref={containerRef}
      className={`
        relative
        overflow-hidden
        rounded-[28px]
        border border-white/45
        shadow-[0_16px_48px_rgba(15,23,42,0.055)]
        transition-all duration-500 ease-out
        ${
          isHovering
            ? "border-white/60 shadow-[0_24px_64px_rgba(15,23,42,0.12)]"
            : ""
        }
        ${className}
      `}
      style={{
        background:
          interactive && isHovering
            ? `
              radial-gradient(
                600px at ${mousePosition.x}px ${mousePosition.y}px,
                rgba(255, 255, 255, 0.15),
                rgba(255, 255, 255, ${opacity * 0.2})
              ),
              rgba(255, 255, 255, 0.055)
            `
            : `rgba(255, 255, 255, 0.055)`,
        backdropFilter: `blur(${blur}px) saturate(${saturate}%) contrast(112%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(${saturate}%) contrast(112%)`,
      }}
    >
      {/* Animated shine effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 24% 18%, rgba(255,255,255,.46), transparent 24%),
            radial-gradient(circle at 78% 72%, rgba(255,255,255,.18), transparent 30%),
            linear-gradient(115deg, transparent 28%, rgba(255,255,255,.32) 48%, transparent 66%)
          `,
          filter: "blur(18px)",
          opacity: 0.75,
          mixBlendMode: "screen",
          animation: "apple-liquid-drift 8s ease-in-out infinite",
        }}
      />

      {/* Refraction layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 18% 20%, rgba(255,255,255,.28), transparent 34%),
            radial-gradient(ellipse at 88% 80%, rgba(0,0,0,.20), transparent 36%),
            linear-gradient(135deg, rgba(255,255,255,.18), transparent 44%, rgba(255,255,255,.08))
          `,
          opacity: 0.88,
          mixBlendMode: "overlay",
        }}
      />

      {/* Rim highlight */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[28px]"
        style={{
          border: "1px solid rgba(255,255,255,.34)",
          boxShadow: `
            inset 12px 0 26px rgba(255,255,255,.18),
            inset -12px 0 30px rgba(255,255,255,.10),
            inset 0 18px 28px rgba(255,255,255,.24),
            inset 0 -22px 34px rgba(0,0,0,.24)
          `,
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute top-0 left-[12%] right-[12%] pointer-events-none rounded-full"
        style={{
          height: "10px",
          background: "rgba(255,255,255,.72)",
          filter: "blur(7px)",
          opacity: 0.8,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
