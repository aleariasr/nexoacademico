"use client";

import { useSidebar } from "@/components/layout/SidebarContext";
import Button from "@/components/ui/Button";
import Surface from "@/components/ui/Surface";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "md" | "lg";
};

const sizes = {
  md: "max-w-xl",
  lg: "max-w-3xl",
};

const modalSpring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.7,
};

export default function Modal({
  open,
  title,
  description,
  children,
  onClose,
  size = "md",
}: ModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { contentOffset } = useSidebar();

  const leftOffset = isDesktop ? contentOffset : 0;

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="pointer-events-none fixed inset-0 z-[9999]">
          <motion.button
            type="button"
            aria-label="Cerrar modal"
            onClick={onClose}
            initial={{
              opacity: 0,
              left: leftOffset,
            }}
            animate={{
              opacity: 1,
              left: leftOffset,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              opacity: {
                duration: 0.2,
              },
              left: modalSpring,
            }}
            className="pointer-events-auto fixed inset-y-0 right-0 cursor-default bg-white/48 backdrop-blur-[36px] backdrop-saturate-150"
          />

          <motion.div
            initial={false}
            animate={{
              left: leftOffset,
            }}
            transition={modalSpring}
            className="pointer-events-none fixed inset-y-0 right-0 flex items-center justify-center overflow-y-auto px-4 py-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby={
                description ? "modal-description" : undefined
              }
              initial={{
                opacity: 0,
                y: 14,
                scale: 0.985,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.985,
              }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 38,
                mass: 0.8,
              }}
              className={`pointer-events-auto relative z-10 w-full ${sizes[size]}`}
            >
              <Surface
                variant="floating"
                radius="liquid"
                className="relative max-h-[calc(100dvh-3rem)] overflow-hidden border border-white/75 bg-white/30 shadow-[0_32px_100px_rgba(37,99,235,0.20)] backdrop-blur-[34px]"
              >
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/95" />

                <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-liquid)] bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.78),transparent_36%),radial-gradient(circle_at_80%_100%,rgba(10,132,255,0.16),transparent_34%)]" />

                <header className="relative z-10 flex items-start justify-between gap-4 border-b border-white/45 px-6 py-5">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0A84FF]">
                      NexoAcadémico
                    </p>

                    <h2
                      id="modal-title"
                      className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    >
                      {title}
                    </h2>

                    {description && (
                      <p
                        id="modal-description"
                        className="mt-1 max-w-xl text-sm leading-6 text-slate-500"
                      >
                        {description}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="glass"
                    size="icon"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                    className="shrink-0 bg-white/45"
                  >
                    <X size={19} />
                  </Button>
                </header>

                <div className="relative z-10 max-h-[calc(100dvh-10rem)] overflow-y-auto px-6 py-5">
                  {children}
                </div>
              </Surface>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}