"use client";

import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { getToken } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader eyebrow="Account" title="Settings" />

      <GlassCard className="p-6">
        <EmptyState
          title="Settings panel"
          description="Settings are not connected to backend preferences yet."
        />
      </GlassCard>
    </div>
  );
}