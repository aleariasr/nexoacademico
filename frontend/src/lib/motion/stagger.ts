import { MotionTiming } from "./timing";

export const MotionStagger = {
  none: {},

  page: {
    transition: {
      staggerChildren: MotionTiming.stagger,
      delayChildren: 0.04,
    },
  },

  section: {
    transition: {
      staggerChildren: 0.06,
    },
  },

  list: {
    transition: {
      staggerChildren: 0.045,
    },
  },
} as const;