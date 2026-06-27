import Surface from "@/components/ui/Surface";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  radius?: "lg" | "xl" | "liquid";
  variant?: "panel" | "card" | "floating";
};

export default function GlassCard({
  children,
  className = "",
  radius = "xl",
  variant = "card",
}: GlassCardProps) {
  return (
    <Surface variant={variant} radius={radius} className={className}>
      {children}
    </Surface>
  );
}