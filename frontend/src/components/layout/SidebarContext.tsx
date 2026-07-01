"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";

export const SIDEBAR_COLLAPSED_OFFSET = 112;
export const SIDEBAR_EXPANDED_OFFSET = 330;

type SidebarContextValue = {
  expanded: boolean;
  contentOffset: number;
  toggleSidebar: () => void;
  setExpanded: (expanded: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

type SidebarProviderProps = {
  children: React.ReactNode;
};

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [expanded, setExpandedState] = useState(false);

  useEffect(() => {
    const storedValue = window.sessionStorage.getItem(SIDEBAR_STORAGE_KEY);

    setExpandedState(storedValue === "true");
  }, []);

  function setExpanded(value: boolean) {
    setExpandedState(value);
    window.sessionStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
  }

  function toggleSidebar() {
    setExpanded(!expanded);
  }

  const value = useMemo(
    () => ({
      expanded,
      contentOffset: expanded
        ? SIDEBAR_EXPANDED_OFFSET
        : SIDEBAR_COLLAPSED_OFFSET,
      toggleSidebar,
      setExpanded,
    }),
    [expanded],
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar debe utilizarse dentro de SidebarProvider.");
  }

  return context;
}