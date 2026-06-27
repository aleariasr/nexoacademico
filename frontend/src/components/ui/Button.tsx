"use client";

import { motion } from "framer-motion";

import type { MotionButtonProps } from "@/types/ui";

import { MotionHover } from "@/lib/motion/hover";
import { MotionPress } from "@/lib/motion/press";
import { MotionTransitions } from "@/lib/motion/transitions";
import type { ReactNode } from "react";

import { Check } from "lucide-react";

import { MotionDots } from "@/components/motion";

type ButtonVariant = "primary" | "glass" | "ghost";
type ButtonSize = "sm" | "md" | "icon";
type ButtonState =
  | "idle"
  | "loading"
  | "success";

type ButtonProps = Omit<MotionButtonProps, "children"> & {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  motion?: boolean;
  state?: ButtonState;
};

const base =
  "nexo-pressable group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden font-semibold outline-none disabled:pointer-events-none disabled:opacity-45";

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
  children,
  className = "",
  variant = "glass",
  size = "md",
  type = "button",
  motion: motionEnabled = true,
  state = "idle",
  ...props
}: ButtonProps) {

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isDisabled = props.disabled || isLoading || isSuccess;

  return (
    <motion.button
      type={type}
      whileHover={motionEnabled && !isDisabled ? MotionHover.button : MotionHover.none}
      whileTap={motionEnabled && !isDisabled ? MotionPress.button : MotionPress.none}
      transition={MotionTransitions.press}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
      disabled={isDisabled}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-full bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.34)_42%,transparent_68%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <span>Working</span>
            <MotionDots />
          </>
        ) : isSuccess ? (
          <>
            <span>Done</span>
            <Check size={18} strokeWidth={2.2} />
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}