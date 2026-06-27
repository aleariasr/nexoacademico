"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MotionEasing } from "@/lib/motion/easing";

type MotionRevealDirection = "up" | "down" | "left" | "right" | "none";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: MotionRevealDirection;
  blur?: boolean;
};

const offset = {
  up: { y: 26 },
  down: { y: -18 },
  left: { x: -140 },
  right: { x: 96 },
  none: {},
};

export default function MotionReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  blur = false,
}: MotionRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        ...offset[direction],
        filter: blur ? "blur(6px)" : "blur(0px)",
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}
        transition={{
            delay,
            duration: 0.68,
            ease: MotionEasing.emphasized,
        }}
      className={className}
    >
      {children}
    </motion.div>
  );
}