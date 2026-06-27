"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MotionVariants } from "@/lib/motion/variants";

import { MotionHover } from "@/lib/motion/hover";
import { MotionPress } from "@/lib/motion/press";

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  tap?: boolean;
};

export default function MotionCard({
  children,
  className,
  delay = 0,
  hover = true,
  tap = true,
}: MotionCardProps) {
  return (
    <motion.div
      variants={MotionVariants.fadeScale}
      transition={{ delay }}
      whileHover={hover ? MotionHover.card : MotionHover.none}
      whileTap={tap ? MotionPress.card : MotionPress.none}
      className={className}
    >
      {children}
    </motion.div>
  );
}