import GlassCard from "@/components/ui/GlassCard";
import type { ElementType } from "react";

type StatTone = "blue" | "green" | "purple" | "red" | "slate";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ElementType;
  tone?: StatTone;
};

const tones: Record<StatTone, string> = {
  blue: "bg-[var(--primary-soft)] text-[var(--primary)]",
  green: "bg-emerald-400/12 text-emerald-600",
  purple: "bg-purple-400/12 text-purple-600",
  red: "bg-red-500/12 text-red-600",
  slate: "bg-slate-500/12 text-slate-600",
};

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}: StatCardProps) {
  return (
    <GlassCard className="min-h-[128px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{detail}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] ${tones[tone]}`}
        >
          <Icon size={22} strokeWidth={2.1} />
        </div>
      </div>
    </GlassCard>
  );
}