"use client";

import { logout } from "@/services/auth.service";
import AnimatedAppShell from "@/components/animations/AnimatedAppShell";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigation from "../navigation/BottomNavigation";
import Sidebar from "../navigation/Sidebar";
import Button from "@/components/ui/Button";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
      <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">
          <div className="mb-5 flex justify-end">
            <Button variant="glass" onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </Button>
          </div>

          <AnimatedAppShell>{children}</AnimatedAppShell>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}