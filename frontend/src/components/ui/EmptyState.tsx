import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        mt-5 flex min-h-[260px] flex-col items-center justify-center
        rounded-[var(--radius-lg)] border border-dashed border-slate-400/30
        bg-white/18 px-6 text-center
        ${className}
      `}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/35 text-slate-500 shadow-sm">
        <Inbox size={22} strokeWidth={2} />
      </div>

      <p className="font-semibold text-slate-950">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}