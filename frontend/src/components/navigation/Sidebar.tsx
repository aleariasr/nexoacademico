"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import Surface from "@/components/ui/Surface";
import { MotionHover } from "@/lib/motion/hover";
import { MotionPress } from "@/lib/motion/press";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
];

const spring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.7,
};

const itemSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 36,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [expanded, setExpanded] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("sidebar-expanded") === "true";
  });

  function toggleSidebar() {
    setExpanded((value) => {
      const nextValue = !value;
      window.sessionStorage.setItem("sidebar-expanded", String(nextValue));
      return nextValue;
    });
  }

  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 p-5 md:block">
      <motion.div
        initial={false}
        animate={{ width: expanded ? 278 : 82 }}
        transition={spring}
        className="h-full"
      >
        <Surface variant="sidebar" radius="2xl" className="h-full">
          <div className="flex h-full flex-col p-3">
            <div className="mb-5 flex h-12 items-center gap-3">
              <motion.button
                type="button"
                aria-label="Toggle sidebar"
                onClick={toggleSidebar}
                whileHover={MotionHover.button}
                whileTap={MotionPress.icon}
                transition={itemSpring}
                className="nexo-surface-control flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] text-slate-950"
              >
                {expanded ? (
                  <ChevronLeft size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </motion.button>

              <motion.div
                initial={false}
                animate={{
                  opacity: expanded ? 1 : 0,
                  width: expanded ? "auto" : 0,
                  x: expanded ? 0 : -8,
                }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <div className="rounded-full bg-white/22 px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-white/45">
                  NexoAcadémico
                </div>
              </motion.div>
            </div>

            <nav className="flex flex-col gap-2">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;

                return (
                  <Link key={link.href} href={link.href} aria-label={link.label}>
                    <SidebarItem
                      active={active}
                      expanded={expanded}
                      icon={Icon}
                      label={link.label}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-2 pb-2">
              <RailAction
                expanded={expanded}
                icon={UserRound}
                label="Profile"
                onClick={() => router.push("/profile")}
              />
              <RailAction
                expanded={expanded}
                icon={Settings}
                label="Settings"
                onClick={() => router.push("/settings")}
              />
            </div>
          </div>
        </Surface>
      </motion.div>
    </aside>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  expanded,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  expanded: boolean;
}) {
  return (
    <motion.div
      whileHover={expanded ? MotionHover.sidebar : MotionHover.button}
      whileTap={MotionPress.sidebar}
      transition={itemSpring}
      className="relative flex h-12 items-center gap-3 rounded-[20px] px-[15px] text-slate-900 transition-colors hover:text-black"
    >
      {active ? (
        <motion.div
          layoutId="sidebar-selection"
          className="absolute inset-0 rounded-[20px] border border-white/65 bg-white/45 shadow-[0_12px_34px_rgba(15,23,42,0.10)] backdrop-blur-2xl"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 34,
            mass: 0.75,
          }}
        />
      ) : (
        <div className="absolute inset-0 rounded-[20px] transition-colors duration-300 hover:bg-white/18" />
      )}

      <motion.span
        animate={{ scale: active ? 1.08 : 1 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
        }}
        className={`relative z-10 shrink-0 ${
          active ? "text-[#0A84FF]" : "text-slate-700"
        }`}
      >
        <Icon size={21} strokeWidth={2.1} />
      </motion.span>

      <motion.span
        initial={false}
        animate={{
          opacity: expanded ? 1 : 0,
          width: expanded ? "auto" : 0,
          x: expanded ? 0 : -6,
        }}
        transition={{ duration: 0.16 }}
        className="relative z-10 overflow-hidden whitespace-nowrap text-[15px] font-medium"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

function RailAction({
  icon: Icon,
  label,
  expanded,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={expanded ? MotionHover.sidebar : MotionHover.button}
      whileTap={MotionPress.sidebar}
      transition={itemSpring}
      className="relative flex h-12 items-center gap-3 rounded-[20px] px-[15px] text-left text-slate-900 transition-colors hover:bg-white/16"
    >
      <Icon size={21} strokeWidth={2.1} className="relative z-10 shrink-0" />

      <motion.span
        initial={false}
        animate={{
          opacity: expanded ? 1 : 0,
          width: expanded ? "auto" : 0,
          x: expanded ? 0 : -6,
        }}
        transition={{ duration: 0.16 }}
        className="relative z-10 overflow-hidden whitespace-nowrap text-[15px] font-medium"
      >
        {label}
      </motion.span>
    </motion.button>
  );
}