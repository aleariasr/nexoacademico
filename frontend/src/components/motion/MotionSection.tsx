"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MotionStagger } from "@/lib/motion/stagger";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function MotionSection({
  children,
  className,
}: MotionSectionProps) {
  return (
    <motion.section
      variants={{
        hidden: {},
        show: MotionStagger.section,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}