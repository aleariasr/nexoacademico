"use client";

import {
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Surface from "@/components/ui/Surface";
import { MotionHover } from "@/lib/motion/hover";
import { MotionPress } from "@/lib/motion/press";

import { getStoredUser, type User } from "@/services/auth.service";
import { useEffect, useMemo, useState } from "react";

const links = [
  {
    href: "/dashboard",
    label: "Home",
    icon: LayoutDashboard,
  },
  {
    href: "/courses",
    label: "Courses",
    icon: BookOpen,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setUser(getStoredUser());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const visibleLinks = useMemo(() => {
    return links.filter((link) => {
      if ("hiddenForAdmin" in link && link.hiddenForAdmin) {
        return user?.role !== "admin";
      }

      return true;
    });
  }, [user]);

  return (
    <nav className="fixed bottom-5 left-4 right-4 z-50 md:hidden">
      <Surface variant="floating" radius="2xl" className="grid auto-cols-fr grid-flow-col p-2">
        {visibleLinks.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={MotionHover.button}
                whileTap={MotionPress.icon}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 30,
                }}
                className={`
                  relative
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-[22px]
                  py-2
                  text-[11px]
                  font-medium
                  transition-colors
                  ${
                    active
                      ? "bg-white/35 text-slate-950 shadow-sm"
                      : "text-slate-500"
                  }
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={2}
                  className={active ? "text-[#0A84FF]" : "text-zinc-500"}
                />

                <span>{link.label}</span>

                {active && (
                  <motion.div
                    layoutId="bottom-active-indicator"
                    className="absolute top-1.5 h-1 w-5 rounded-full bg-[#0A84FF]"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 38,
                    }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </Surface>
    </nav>
  );
}