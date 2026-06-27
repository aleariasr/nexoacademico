type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
};

export default function PageHeader({
  eyebrow = "Academic workspace",
  title,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-6">
      <div>
        <p className="text-base font-medium text-slate-500">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-slate-950 md:text-[42px]">
          {title}
        </h1>
      </div>

      {children ? <div className="flex items-center gap-3">{children}</div> : null}
    </header>
  );
}