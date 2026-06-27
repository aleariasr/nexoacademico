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

  return (
    <aside className="hidden shrink-0 p-5 md:block">
      <motion.div
        initial={false}
        animate={{ width: expanded ? 278 : 82 }}
        transition={spring}
        className="sticky top-5 h-[calc(100dvh-40px)]"
      >
        <div className="relative isolate h-full overflow-hidden rounded-[36px] border border-white/60 bg-white/35 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(10,132,255,0.28),transparent_320px),radial-gradient(circle_at_0%_70%,rgba(175,82,222,0.18),transparent_380px),linear-gradient(135deg,rgba(255,255,255,0.62),rgba(235,243,255,0.38))]" />
          <div className="pointer-events-none absolute inset-0 rounded-[36px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-30px_60px_rgba(255,255,255,0.22)]" />

          <div className="relative z-10 flex h-full flex-col p-3 pt-[76px]">
            <motion.button
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setExpanded((value) => !value)}
              whileHover={{ scale: 1.045 }}
              whileTap={{ scale: 0.94 }}
              transition={itemSpring}
              className="absolute left-3 top-3 flex h-12 w-12 items-center justify-center rounded-[20px] border border-white/55 bg-white/45 text-slate-950 shadow-sm backdrop-blur-xl transition-colors hover:bg-white/65"
            >
              {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </motion.button>

            <nav className="flex flex-col gap-2">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;

                return (
                  <Link key={link.href} href={link.href} aria-label={link.label}>
                    <SidebarItem active={active} expanded={expanded} icon={Icon} label={link.label} />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-2 pb-2">
              <RailAction expanded={expanded} icon={UserRound} label="Profile" onClick={() => router.push("/profile")} />
              <RailAction expanded={expanded} icon={Settings} label="Settings" onClick={() => router.push("/settings")} />
            </div>
          </div>
        </div>
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
      whileHover={{ scale: 1.02, x: expanded ? 2 : 0 }}
      whileTap={{ scale: 0.965 }}
      transition={itemSpring}
      className="relative flex h-12 items-center gap-3 rounded-[20px] px-[15px] text-slate-900 transition-colors hover:text-black"
    >
      {active ? (
        <motion.div
          layoutId="sidebar-selection"
          className="absolute inset-0 rounded-[20px] border border-white/65 bg-white/55 shadow-sm backdrop-blur-xl"
          transition={spring}
        />
      ) : (
        <div className="absolute inset-0 rounded-[20px] transition-colors duration-300 hover:bg-white/35" />
      )}

      <Icon size={21} strokeWidth={2.1} className={`relative z-10 shrink-0 ${active ? "text-[#0A84FF]" : ""}`} />

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
      whileHover={{ scale: 1.02, x: expanded ? 2 : 0 }}
      whileTap={{ scale: 0.965 }}
      transition={itemSpring}
      className="relative flex h-12 items-center gap-3 rounded-[20px] px-[15px] text-left text-slate-900 transition-colors hover:bg-white/35"
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