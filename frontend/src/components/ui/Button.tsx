"use client";

import { motion } from "framer-motion";

import type { MotionButtonProps } from "@/types/ui";

import { MotionHover } from "@/lib/motion/hover";
import { MotionPress } from "@/lib/motion/press";
import { MotionTransitions } from "@/lib/motion/transitions";

type ButtonVariant = "primary" | "glass" | "ghost";
type ButtonSize = "sm" | "md" | "icon";

type ButtonProps = MotionButtonProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  motion?: boolean;
};

const base =
  "nexo-pressable inline-flex items-center justify-center gap-2 font-semibold outline-none disabled:pointer-events-none disabled:opacity-45";

const variants = {
  primary: "nexo-primary text-white",
  glass: "nexo-control text-slate-800",
  ghost: "text-slate-700 hover:bg-white/35",
};

const sizes = {
  sm: "h-9 rounded-full px-3 text-sm",
  md: "h-11 rounded-full px-4 text-sm",
  icon: "h-11 w-11 rounded-full",
};

export default function Button({
  className = "",
  variant = "glass",
  size = "md",
  type = "button",
  motion: motionEnabled = true,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={motionEnabled ? MotionHover.button : MotionHover.none}
      whileTap={motionEnabled ? MotionPress.button : MotionPress.none}
      transition={MotionTransitions.press}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}