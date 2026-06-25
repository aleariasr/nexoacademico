"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-[#0A84FF] text-white shadow-[0_12px_30px_rgba(10,132,255,0.28)]"
      : "glass text-black";

  return (
    <motion.button
      whileHover={{
        y: -2,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 30,
      }}
      className={`
        rounded-full
        px-6
        py-3
        font-medium
        transition-colors
        ${styles}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}