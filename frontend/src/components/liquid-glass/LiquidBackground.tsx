"use client";

import "./liquid-glass.css";

export default function LiquidBackground() {
  return (
    <div className="liquid-scene" aria-hidden="true">
      <div className="liquid-scene__base" />

      <div className="liquid-blob liquid-blob--one" />
      <div className="liquid-blob liquid-blob--two" />
      <div className="liquid-blob liquid-blob--three" />
      <div className="liquid-blob liquid-blob--four" />
      <div className="liquid-blob liquid-blob--five" />

      <div className="liquid-scene__sheen" />
      <div className="liquid-scene__vignette" />
      <div className="liquid-scene__noise" />
    </div>
  );
}