"use client";

import { motion } from "framer-motion";

import { MotionTransitions } from "@/lib/motion/transitions";

const dots = [0, 1, 2];

export default function MotionDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {dots.map((dot) => (
        <motion.span
          key={dot}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{
            opacity: [0.35, 1, 0.35],
            scale: [0.82, 1, 0.82],
          }}
          transition={{
            ...MotionTransitions.pulse,
            delay: dot * 0.12,
          }}
        />
      ))}
    </span>
  );
}