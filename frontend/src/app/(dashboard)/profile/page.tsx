"use client";

import GlassCard from "@/components/ui/GlassCard";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import { getStoredUser, getToken, me, type User } from "@/services/auth.service";
import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const currentUser = await me();
        setUser(currentUser);
      } catch {
        setUser(getStoredUser());
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  if (loading) {
    return <LoadingState label="Loading profile" />;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader eyebrow="Account" title="Profile" />

      <GlassCard className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/45 text-[#0A84FF] ring-1 ring-white/60">
            <UserRound size={34} />
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {displayName(user)}
            </h2>
            <p className="mt-1 text-sm text-slate-500">@{user?.username}</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2">
        <ProfileItem icon={Mail} label="Email" value={user?.email || "No email"} />
        <ProfileItem icon={ShieldCheck} label="Role" value={formatRole(user?.role)} />
        <ProfileItem label="Degree program" value={user?.degree_program || "Not assigned"} />
        <ProfileItem label="User ID" value={user?.id ? String(user.id) : "—"} />
      </div>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/45 text-slate-700 ring-1 ring-white/50">
            <Icon size={18} />
          </div>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-1 font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function displayName(user: User | null) {
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  return fullName || user?.username || "Unknown user";
}

function formatRole(role?: string) {
  if (!role) return "Not assigned";
  if (role === "admin") return "Administrator";
  if (role === "professor") return "Professor";
  if (role === "student") return "Student";
  return role;
}