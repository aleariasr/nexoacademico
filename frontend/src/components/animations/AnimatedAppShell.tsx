"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type AnimatedAppShellProps = {
  children: ReactNode;
};

export default function AnimatedAppShell({ children }: AnimatedAppShellProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
      transition={{ duration: 0.32, ease: [0.2, 0.85, 0.2, 1] }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
