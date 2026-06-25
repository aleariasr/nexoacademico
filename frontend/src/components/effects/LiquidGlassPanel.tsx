"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    html2canvas?: unknown;
    liquidGL?: (options: {
      snapshot?: string;
      target: string;
      resolution?: number;
      refraction?: number;
      bevelDepth?: number;
      bevelWidth?: number;
      frost?: number;
      shadow?: boolean;
      specular?: boolean;
      reveal?: "none" | "fade";
      tilt?: boolean;
      tiltFactor?: number;
      magnify?: number;
      liveSnapshot?: boolean;
      liveSnapshotInterval?: number;
    }) => unknown;
  }
}

type LiquidGlassPanelProps = {
  className?: string;
  enabled?: boolean;
  snapshot?: string;
  liveSnapshot?: boolean;
  liveSnapshotInterval?: number;
};

export default function LiquidGlassPanel({
  className = "",
  enabled = true,
  snapshot = "#liquid-snapshot-source",
  liveSnapshot = false,
  liveSnapshotInterval = 900,
}: LiquidGlassPanelProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const targetClass = `liquid-glass-${id}`;

  const initialized = useRef(false);
  const [html2CanvasReady, setHtml2CanvasReady] = useState(false);
  const [liquidReady, setLiquidReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadHtml2Canvas() {
      const html2CanvasModule = await import("html2canvas");

      if (cancelled) return;

      window.html2canvas = html2CanvasModule.default;
      setHtml2CanvasReady(true);
    }

    loadHtml2Canvas();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (initialized.current) return;
    if (!html2CanvasReady || !liquidReady) return;
    if (!window.liquidGL || !window.html2canvas) return;

    const timer = window.setTimeout(() => {
      const snapshotElement = document.querySelector(snapshot);
      const targetElement = document.querySelector(`.${targetClass}`);

      if (!snapshotElement || !targetElement) return;

      initialized.current = true;

      window.liquidGL?.({
        snapshot,
        target: `.${targetClass}`,
        resolution: 1.45,
        refraction: 0,
        bevelDepth: 0.052,
        bevelWidth: 0.18,
        frost: 2,
        shadow: true,
        specular: true,
        reveal: "fade",
        tilt: false,
        tiltFactor: 0,
        magnify: 1,
      });
    }, 650);

    return () => window.clearTimeout(timer);
  }, [
    enabled,
    html2CanvasReady,
    liquidReady,
    snapshot,
    targetClass,
    liveSnapshot,
    liveSnapshotInterval,
  ]);

  return (
    <>
      <Script
        src="/vendor/liquidGL.js"
        strategy="afterInteractive"
        onLoad={() => setLiquidReady(true)}
      />

      <div
        aria-hidden="true"
        className={`
          ${targetClass}
          liquidGL
          pointer-events-none
          absolute
          inset-0
          z-[40]
          rounded-[42px]
          bg-transparent
          shadow-[0_28px_90px_rgba(0,0,0,0.22)]
          ${className}
        `}
      />
    </>
  );
}