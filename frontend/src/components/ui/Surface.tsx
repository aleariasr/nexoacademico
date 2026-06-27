type SurfaceVariant = "panel" | "card" | "control" | "floating";
type SurfaceRadius = "md" | "lg" | "xl" | "2xl" | "liquid";

type SurfaceProps = {
  children: React.ReactNode;
  className?: string;
  variant?: SurfaceVariant;
  radius?: SurfaceRadius;
};

const variants: Record<SurfaceVariant, string> = {
  panel: "nexo-surface-panel",
  card: "nexo-surface-card",
  control: "nexo-surface-control",
  floating: "nexo-surface-floating",
};

const radii: Record<SurfaceRadius, string> = {
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--radius-xl)]",
  "2xl": "rounded-[var(--radius-2xl)]",
  liquid: "rounded-[var(--radius-liquid)]",
};

export default function Surface({
  children,
  className = "",
  variant = "card",
  radius = "xl",
}: SurfaceProps) {
  return (
    <div className={`${variants[variant]} ${radii[radius]} ${className}`}>
      {children}
    </div>
  );
}