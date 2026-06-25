"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { registerLiquidLens } from "./LiquidGlassRenderer";
import "./liquid-glass.css";

type AppleLiquidGlassProps = {
  children: ReactNode;
  className?: string;
  radius?: number;
};

export default function AppleLiquidGlass({
  children,
  className = "",
  radius = 42,
}: AppleLiquidGlassProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const unregister = registerLiquidLens({
      id,
      element,
      radius,
    });

    return () => {
      unregister();
    };
  }, [id, radius]);

  return (
    <motion.div
      ref={ref}
      className={`apple-liquid-root ${className}`}
      style={{ "--glass-radius": `${radius}px` } as React.CSSProperties}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="apple-liquid-backdrop" />
      <div className="apple-liquid-lens" />
      <div className="apple-liquid-distortion" />
      <div className="apple-liquid-volume" />
      <div className="apple-liquid-rim" />
      <div className="apple-liquid-highlight" />
      <div className="apple-liquid-specular" />
      <div className="apple-liquid-noise" />

      <div className="apple-liquid-content">{children}</div>
    </motion.div>
  );
}