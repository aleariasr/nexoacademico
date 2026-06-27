import { MotionTiming } from "./timing";
import { MotionEasing } from "./easing";

export const MotionTransitions = {
  page: {
    duration: MotionTiming.page,
    ease: MotionEasing.standard,
  },

  card: {
    duration: MotionTiming.medium,
    ease: MotionEasing.standard,
  },

  modal: {
    duration: MotionTiming.modal,
    ease: MotionEasing.emphasized,
  },

  button: {
    duration: MotionTiming.fast,
    ease: MotionEasing.standard,
  },

  hover: {
    duration: MotionTiming.instant,
    ease: MotionEasing.standard,
  },

  press: {
    type: "spring",
    stiffness: 520,
    damping: 34,
    mass: 0.72,
  },

  pulse: {
    duration: 0.9,
    ease: MotionEasing.standard,
    repeat: Infinity,
  },
} as const;