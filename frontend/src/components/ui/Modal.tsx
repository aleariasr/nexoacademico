import Button from "@/components/ui/Button";
import Surface from "@/components/ui/Surface";
import { X } from "lucide-react";

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
  lg: "max-w-2xl",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/28 px-4 py-8 backdrop-blur-md">
      <Surface
        variant="floating"
        radius="2xl"
        className={`w-full ${sizes[size]} p-6`}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>

          <Button variant="glass" size="icon" onClick={onClose} aria-label="Close modal">
            <X size={19} />
          </Button>
        </div>

        {children}
      </Surface>
    </div>
  );
}