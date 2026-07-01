"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";
const SIDEBAR_CHANGE_EVENT = "sidebar-expanded-change";

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
  children: ReactNode;
};

function subscribe(callback: () => void) {
  window.addEventListener(SIDEBAR_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return (
    window.sessionStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
  );
}

function getServerSnapshot() {
  return false;
}

export function SidebarProvider({
  children,
}: SidebarProviderProps) {
  const expanded = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setExpanded = useCallback((value: boolean) => {
    window.sessionStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      String(value),
    );

    window.dispatchEvent(
      new Event(SIDEBAR_CHANGE_EVENT),
    );
  }, []);

  const toggleSidebar = useCallback(() => {
    setExpanded(!getSnapshot());
  }, [setExpanded]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      expanded,
      contentOffset: expanded
        ? SIDEBAR_EXPANDED_OFFSET
        : SIDEBAR_COLLAPSED_OFFSET,
      toggleSidebar,
      setExpanded,
    }),
    [expanded, setExpanded, toggleSidebar],
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
    throw new Error(
      "useSidebar debe utilizarse dentro de SidebarProvider.",
    );
  }

  return context;
}