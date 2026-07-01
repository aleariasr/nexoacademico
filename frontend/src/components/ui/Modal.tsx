"use client";

import Button from "@/components/ui/Button";
import Surface from "@/components/ui/Surface";
import { motion } from "framer-motion";
import { X } from "lucide-react";
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

export default function Modal({
  open,
  title,
  description,
  children,
  onClose,
  size = "md",
}: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-y-0 left-0 right-0 z-[9999] flex items-center justify-center overflow-y-auto px-4 py-6 md:left-[330px]">
      <div className="fixed inset-y-0 left-0 right-0 bg-white/48 backdrop-blur-[36px] backdrop-saturate-150 md:left-[330px]" />

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 38,
          mass: 0.8,
        }}
        className={`relative z-10 w-full ${sizes[size]}`}
      >
        <Surface
          variant="floating"
          radius="liquid"
          className="relative max-h-[88vh] overflow-hidden border border-white/75 bg-white/30 shadow-[0_32px_100px_rgba(37,99,235,0.20)] backdrop-blur-[34px]"
        >
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/95" />
          <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-liquid)] bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.78),transparent_36%),radial-gradient(circle_at_80%_100%,rgba(10,132,255,0.16),transparent_34%)]" />

          <header className="relative z-10 flex items-start justify-between gap-4 border-b border-white/45 px-6 py-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0A84FF]">
                NexoAcadémico
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {title}
              </h2>

              {description && (
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  {description}
                </p>
              )}
            </div>

            <Button
              variant="glass"
              size="icon"
              onClick={onClose}
              aria-label="Close modal"
              className="shrink-0 bg-white/45"
            >
              <X size={19} />
            </Button>
          </header>

          <div className="relative z-10 max-h-[calc(88vh-120px)] overflow-y-auto px-6 py-5">
            {children}
          </div>
        </Surface>
      </motion.div>
    </div>,
    document.body
  );
}