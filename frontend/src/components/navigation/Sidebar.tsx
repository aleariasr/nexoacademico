"use client";

import LiquidGlassPanel from "@/components/effects/LiquidGlassPanel";
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
import { usePathname } from "next/navigation";
import { useState } from "react";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
];

const sidebarSpring = {
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

const activeSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="hidden shrink-0 p-5 md:block">
      <motion.div
        initial={false}
        animate={{ width: expanded ? 278 : 82 }}
        transition={sidebarSpring}
        className="sticky top-5 h-[calc(100dvh-40px)]"
      >
        <div
          className="sidebar-liquid-snapshot relative isolate h-full overflow-hidden rounded-[36px]"
          style={{
            background:
              "radial-gradient(circle at 8% 10%, rgba(0,122,255,0.38), transparent 360px), radial-gradient(circle at 0% 70%, rgba(175,82,222,0.22), transparent 420px), linear-gradient(135deg, rgb(246,250,255), rgb(236,242,249))",
          }}
        >
          <LiquidGlassPanel enabled={false} snapshot=".sidebar-liquid-snapshot" />

          <div
            className="pointer-events-none absolute inset-0 z-[10] rounded-[36px]"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}
          />

          <div
            data-liquid-ignore
            className="relative z-[9999] flex h-full flex-col p-3 pt-[76px]"
          >
            <motion.button
              type="button"
              aria-label="Toggle sidebar"
              onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setExpanded((value) => !value);
              }}
              whileHover={{ scale: 1.045 }}
              whileTap={{ scale: 0.94 }}
              transition={itemSpring}
              className="
                absolute left-3 top-3 z-[9999]
                flex h-12 w-12 items-center justify-center
                rounded-[20px]
                bg-white/10 text-slate-950 shadow-sm backdrop-blur-sm
                transition-colors hover:bg-white/18
              "
            >
              {expanded ? (
                <ChevronLeft size={20} strokeWidth={2.2} />
              ) : (
                <ChevronRight size={20} strokeWidth={2.2} />
              )}
            </motion.button>

            <nav className="flex flex-col gap-2">
              {mainLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;

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
              <RailAction expanded={expanded} icon={UserRound} label="Profile" />
              <RailAction expanded={expanded} icon={Settings} label="Settings" />
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
      whileHover={{ scale: 1.018, x: expanded ? 2 : 0 }}
      whileTap={{ scale: 0.965 }}
      transition={itemSpring}
      className="
        relative flex h-12 items-center gap-3
        rounded-[20px] px-[15px]
        text-slate-900 transition-colors hover:text-black
      "
    >
      {active && (
        <motion.div
          layoutId="sidebar-selection"
          className="absolute inset-0 rounded-[20px] bg-white/14 shadow-sm backdrop-blur-sm"
          transition={activeSpring}
        />
      )}

      {!active && (
        <div className="absolute inset-0 rounded-[20px] bg-white/0 transition-colors hover:bg-white/8" />
      )}

      <Icon
        size={21}
        strokeWidth={2.1}
        className={`relative z-10 shrink-0 ${active ? "text-[#007AFF]" : ""}`}
      />

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
}: {
  icon: React.ElementType;
  label: string;
  expanded: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.018, x: expanded ? 2 : 0 }}
      whileTap={{ scale: 0.965 }}
      transition={itemSpring}
      className="
        relative flex h-12 items-center gap-3 rounded-[20px]
        px-[15px] text-slate-900 transition-colors hover:text-black
      "
    >
      <div className="absolute inset-0 rounded-[20px] bg-white/0 transition-colors hover:bg-white/8" />

      <Icon size={20} strokeWidth={2.1} className="relative z-10 shrink-0" />

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