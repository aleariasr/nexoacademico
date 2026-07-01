"use client";

import AnimatedAppShell from "@/components/animations/AnimatedAppShell";
import { MotionReveal } from "@/components/motion";
import Button from "@/components/ui/Button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { logout } from "@/services/auth.service";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import BottomNavigation from "../navigation/BottomNavigation";
import Sidebar from "../navigation/Sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "./SidebarContext";

type AppShellProps = {
  children: React.ReactNode;
};

const shellSpring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.7,
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}

function AppShellContent({ children }: AppShellProps) {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { contentOffset } = useSidebar();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Sidebar />

      <motion.main
        initial={false}
        animate={{
          marginLeft: isDesktop ? contentOffset : 0,
        }}
        transition={shellSpring}
        className="relative z-10 min-h-screen min-w-0 px-5 py-6 md:px-8 md:py-8"
      >
        <MotionReveal
          direction="down"
          delay={0.12}
          className="mb-5 flex justify-end"
        >
          <Button variant="glass" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </Button>
        </MotionReveal>

        <MotionReveal delay={0.22} blur>
          <AnimatedAppShell>{children}</AnimatedAppShell>
        </MotionReveal>
      </motion.main>

      <BottomNavigation />
    </div>
  );
}