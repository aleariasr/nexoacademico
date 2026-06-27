"use client";

import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import { getToken } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader eyebrow="Account" title="Profile" />

      <GlassCard className="p-6">
        <EmptyState
          title="Profile details"
          description="Account editing is not connected yet."
        />
      </GlassCard>
    </div>
  );
}