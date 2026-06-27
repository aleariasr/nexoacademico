"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MotionStagger } from "@/lib/motion/stagger";

type MotionPageProps = {
  children: ReactNode;
  className?: string;
};

export default function MotionPage({ children, className }: MotionPageProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: MotionStagger.page,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}