"use client";

import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import LoadingState from "@/components/ui/LoadingState";
import PageHeader from "@/components/ui/PageHeader";
import {
  getStoredUser,
  getToken,
  logout,
  me,
  type User,
} from "@/services/auth.service";
import { LogOut, Shield, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
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

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (loading) {
    return <LoadingState label="Loading settings" />;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader eyebrow="Account" title="Settings" />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <GlassCard className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/45 text-[#0A84FF] ring-1 ring-white/50">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Account
              </h2>
              <p className="text-sm text-slate-500">
                Basic account information for the current session.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <SettingRow label="Username" value={user?.username || "—"} />
            <SettingRow label="Email" value={user?.email || "No email"} />
            <SettingRow label="Role" value={formatRole(user?.role)} />
            <SettingRow
              label="Degree program"
              value={user?.degree_program || "Not assigned"}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/45 text-slate-700 ring-1 ring-white/50">
              <Shield size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Session
              </h2>
              <p className="text-sm text-slate-500">
                Manage access to this device.
              </p>
            </div>
          </div>

          <Button
            variant="glass"
            className="w-full justify-center text-red-600 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/35 bg-white/25 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function formatRole(role?: string) {
  if (!role) return "Not assigned";
  if (role === "admin") return "Administrator";
  if (role === "professor") return "Professor";
  if (role === "student") return "Student";
  return role;
}