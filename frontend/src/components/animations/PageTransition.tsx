"use client";

import { ReactNode, useEffect, useState } from "react";

type PageTransitionProps = {
  children: ReactNode;
  delay?: number;
};

export default function PageTransition({
  children,
  delay = 0,
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`
        transition-all duration-1000 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }
      `}
    >
      {children}
    </div>
  );
}
