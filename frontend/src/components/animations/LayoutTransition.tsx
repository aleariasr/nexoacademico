"use client";

import { useEffect, useState, ReactNode } from "react";

type LayoutTransitionProps = {
  children: ReactNode;
};

export default function LayoutTransition({ children }: LayoutTransitionProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen animate-fade-in"
      style={{
        animation: "page-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      {children}
    </div>
  );
}
