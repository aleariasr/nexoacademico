type DemoGlassCardProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function DemoGlassCard({
  children,
  className = "",
}: DemoGlassCardProps) {
  return (
    <div className={`demo-glass-card ${className}`}>
      <div className="demo-glass-card__surface" />
      <div className="demo-glass-card__rim" />
      <div className="demo-glass-card__inner" />
      <div className="demo-glass-card__highlight" />
      <div className="demo-glass-card__content">{children}</div>
    </div>
  );
}