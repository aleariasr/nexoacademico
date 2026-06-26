"use client";

import { logout } from "@/services/auth.service";
import { LogOut } from "lucide-react";
import BottomNavigation from "../navigation/BottomNavigation";
import Sidebar from "../navigation/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

const appBackground = `
  radial-gradient(circle at 5% 18%, rgba(0,122,255,0.28), transparent 520px),
  radial-gradient(circle at 28% 42%, rgba(175,82,222,0.16), transparent 430px),
  radial-gradient(circle at 80% 0%, rgba(255,255,255,0.95), transparent 620px),
  linear-gradient(135deg, rgb(234,244,255) 0%, rgb(247,251,255) 45%, rgb(238,245,255) 100%)
`;

export default function AppShell({ children }: AppShellProps) {

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: appBackground }}
    >
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 py-8 pl-4 pr-8">
          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 items-center gap-2 rounded-full bg-white/40 px-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-white/50 transition hover:bg-white/60"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          {children}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}