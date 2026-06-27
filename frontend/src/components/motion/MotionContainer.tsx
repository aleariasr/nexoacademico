"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { MotionStagger } from "@/lib/motion/stagger";

type MotionContainerVariant =
  | "page"
  | "section"
  | "list"
  | "group";

type MotionContainerProps = {
  children: ReactNode;
  className?: string;
  variant?: MotionContainerVariant;
};

const variants = {
  page: MotionStagger.page,
  section: MotionStagger.section,
  list: MotionStagger.list,
  group: MotionStagger.none,
} as const;

export default function MotionContainer({
  children,
  className,
  variant = "group",
}: MotionContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: {},
        show: variants[variant],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}