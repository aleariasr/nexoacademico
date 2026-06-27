"use client";

import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import { getToken } from "@/services/auth.service";
import { getDashboard } from "@/services/dashboard.service";
import type { DashboardResponse } from "@/types/dashboard";
import { BarChart3, CalendarDays, CheckSquare, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";

type StatsState = {
  dashboard: DashboardResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: StatsState = {
  dashboard: null,
  loading: true,
  error: null,
};

export default function StatisticsPage() {
  const router = useRouter();
  const [state, setState] = useState<StatsState>(initialState);

  const loadStatistics = useCallback(async () => {
    try {
      const dashboard = await getDashboard();
      setState({ dashboard, loading: false, error: null });
    } catch (err) {
      setState({
        dashboard: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load statistics",
      });
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadStatistics();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadStatistics, router]);

  if (state.loading) {
    return <LoadingState label="Loading statistics" />;
  }

  const dashboard = state.dashboard;

  const metrics = [
    {
      label: "Active courses",
      value: dashboard ? String(dashboard.active_courses) : "—",
      detail: "Courses currently tracked",
      icon: BarChart3,
      tone: "blue",
    },
    {
      label: "Pending tasks",
      value: dashboard ? String(dashboard.pending_tasks) : "—",
      detail: "Tasks awaiting work",
      icon: CheckSquare,
      tone: "green",
    },
    {
      label: "Overdue tasks",
      value: dashboard ? String(dashboard.overdue_tasks) : "—",
      detail: "Tasks that need attention",
      icon: CalendarDays,
      tone: "purple",
    },
    {
      label: "Completion rate",
      value: dashboard ? `${Math.round(dashboard.completion_rate)}%` : "—",
      detail: "Overall progress",
      icon: TrendingUp,
      tone: "blue",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader title="Statistics" />

      {state.error && (
        <GlassCard className="p-5">
          <p className="font-semibold text-slate-950">Unable to load statistics</p>
          <p className="mt-1 text-sm text-slate-500">{state.error}</p>
        </GlassCard>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            icon={metric.icon}
            tone={metric.tone as "blue" | "green" | "purple"}
          />
        ))}
      </section>

      <GlassCard className="p-6">
        <SectionHeader title="Summary" />

        {dashboard ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <InfoBlock
              title="Completion"
              value={`${Math.round(dashboard.completion_rate)}%`}
              description="Based on the current task set and progress updates."
            />
            <InfoBlock
              title="Workload"
              value={String(dashboard.pending_tasks + dashboard.overdue_tasks)}
              description="Open tasks that still need attention."
            />
          </div>
        ) : (
          <EmptyState
            title="No statistics available"
            description="Connect the backend to show real trends and summaries here."
          />
        )}
      </GlassCard>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>;
}

function InfoBlock({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-glass)] bg-[var(--surface-glass-subtle)] p-5">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}