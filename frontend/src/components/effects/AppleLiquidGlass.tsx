type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function AppleLiquidGlass({ children, className = "" }: Props) {
  return (
    <div className={`apple-liquid-glass ${className}`}>
      <div className="apple-liquid-glass__refraction" />
      <div className="apple-liquid-glass__rim" />
      <div className="apple-liquid-glass__specular" />
      <div className="apple-liquid-glass__content">{children}</div>
    </div>
  );
}