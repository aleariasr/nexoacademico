"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MotionEasing } from "@/lib/motion/easing";

type MotionSidebarProps = {
  children: ReactNode;
  className?: string;
};

export default function MotionSidebar({
  children,
  className,
}: MotionSidebarProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -140,
        scale: 0.982,
        filter: "blur(10px)",
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.72,
        ease: MotionEasing.emphasized,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}