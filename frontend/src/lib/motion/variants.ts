import type { Variants } from "framer-motion";

import { MotionTransitions } from "./transitions";

export const MotionVariants = {
  fade: {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: MotionTransitions.page,
    },
  },

  fadeUp: {
    hidden: {
      opacity: 0,
      y: 16,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: MotionTransitions.card,
    },
  },

  fadeScale: {
    hidden: {
      opacity: 0,
      scale: 0.98,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: MotionTransitions.card,
    },
  },

  stagger: {
    hidden: {},

    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  },
} satisfies Record<string, Variants>;