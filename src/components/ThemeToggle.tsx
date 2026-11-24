"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";

type Mode = "auto" | "light" | "dark";
const KEY = `${brand.storagePrefix}.theme`;
const NEXT: Record<Mode, Mode> = { auto: "light", light: "dark", dark: "auto" };
const LABEL: Record<Mode, string> = {
  auto: "Tema: automático",
  light: "Tema: claro (creme)",
  dark: "Tema: escuro",
};

function Icon({ mode }: { mode: Mode }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
  };
  if (mode === "dark")
    return (
      <svg {...common}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
      </svg>
    );
  if (mode === "light")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </svg>
  );
}

function apply(mode: Mode) {
  const root = document.documentElement;
  if (mode === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("auto");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") setMode(saved);
    } catch {
      /* sem armazenamento: segue o tema do sistema */
    }
  }, []);

  function cycle() {
    const next = NEXT[mode];
    setMode(next);
    apply(next);
    try {
      if (next === "auto") window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, next);
    } catch {
      /* ignora */
    }
  }

  return (
    <button
      type="button"
      className="btn icon-btn btn-sm"
      onClick={cycle}
      aria-label={`${LABEL[mode]}. Clique para alternar.`}
      title={LABEL[mode]}
    >
      <Icon mode={mode} />
    </button>
  );
}
