"use client";

import { useSidebar } from "@/components/layout/SidebarContext";
import Button from "@/components/ui/Button";
import Surface from "@/components/ui/Surface";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId } from "react";
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

  const titleId = useId();
  const descriptionId = useId();

  const desktopInset = 20;
  const leftOffset = isDesktop ? contentOffset : 0;
  const verticalInset = isDesktop ? desktopInset : 0;
  const rightInset = isDesktop ? desktopInset : 0;

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
              top: verticalInset,
              right: rightInset,
              bottom: verticalInset,
            }}
            animate={{
              opacity: 1,
              left: leftOffset,
              top: verticalInset,
              right: rightInset,
              bottom: verticalInset,
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
            className="
              pointer-events-auto
              fixed
              cursor-default
              overflow-hidden
              rounded-none
              border
              border-white/50
              bg-white/32
              shadow-[0_24px_80px_rgba(15,23,42,0.10)]
              backdrop-blur-[30px]
              backdrop-saturate-150
              md:rounded-[32px]
            "
          >
            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.42),transparent_38%),radial-gradient(circle_at_90%_100%,rgba(10,132,255,0.08),transparent_35%)]
              "
            />
          </motion.button>

          <motion.div
            initial={false}
            animate={{
              left: leftOffset,
              top: verticalInset,
              right: rightInset,
              bottom: verticalInset,
            }}
            transition={modalSpring}
            className="
              pointer-events-none
              fixed
              flex
              items-center
              justify-center
              overflow-y-auto
              px-4
              py-6
              sm:px-6
            "
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={
                description ? descriptionId : undefined
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
              className={`
                pointer-events-auto
                relative
                z-10
                w-full
                ${sizes[size]}
              `}
            >
              <Surface
                variant="floating"
                radius="2xl"
                className="
                  relative
                  max-h-[calc(100dvh-5rem)]
                  overflow-hidden
                  border
                  border-white/65
                  bg-white/40
                  shadow-[0_28px_90px_rgba(15,23,42,0.16)]
                  backdrop-blur-[34px]
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-x-8
                    top-0
                    h-px
                    bg-white/90
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[inherit]
                    bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.68),transparent_36%),radial-gradient(circle_at_82%_100%,rgba(10,132,255,0.12),transparent_34%)]
                  "
                />

                <header
                  className="
                    relative
                    z-10
                    flex
                    items-start
                    justify-between
                    gap-4
                    border-b
                    border-white/40
                    px-6
                    py-5
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.24em]
                        text-[#0A84FF]
                      "
                    >
                      NexoAcadémico
                    </p>

                    <h2
                      id={titleId}
                      className="
                        mt-1
                        text-2xl
                        font-semibold
                        tracking-[-0.03em]
                        text-slate-950
                      "
                    >
                      {title}
                    </h2>

                    {description && (
                      <p
                        id={descriptionId}
                        className="
                          mt-1
                          max-w-xl
                          text-sm
                          leading-6
                          text-slate-500
                        "
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
                    className="shrink-0 bg-white/40"
                  >
                    <X size={19} />
                  </Button>
                </header>

                <div
                  className="
                    relative
                    z-10
                    max-h-[calc(100dvh-12rem)]
                    overflow-y-auto
                    px-6
                    py-5
                  "
                >
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