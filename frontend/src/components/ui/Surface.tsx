type SurfaceVariant =
  | "panel"
  | "card"
  | "control"
  | "floating"
  | "sidebar"
  | "toolbar"
  | "input";

type SurfaceRadius = "md" | "lg" | "xl" | "2xl" | "liquid" | "full";

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
  sidebar: "nexo-surface-sidebar",
  toolbar: "nexo-surface-toolbar",
  input: "nexo-surface-input",
};

const radii: Record<SurfaceRadius, string> = {
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--radius-xl)]",
  "2xl": "rounded-[var(--radius-2xl)]",
  liquid: "rounded-[var(--radius-liquid)]",
  full: "rounded-full",
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