"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";

/**
 * Dois temas apenas: claro (padrão, creme) e escuro. Não segue o tema do
 * sistema de propósito: a prova deve parecer sempre uma folha de papel.
 */
type Mode = "light" | "dark";
const KEY = `${brand.storagePrefix}.theme`;
const BAR: Record<Mode, string> = { light: "#ebe3d1", dark: "#15171b" };

function apply(mode: Mode) {
  document.documentElement.setAttribute("data-theme", mode);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", BAR[mode]);
}

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
  return mode === "dark" ? (
    <svg {...common}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
    </svg>
  ) : (
    <svg {...common}>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    try {
      if (window.localStorage.getItem(KEY) === "dark") {
        setMode("dark");
        apply("dark");
      }
    } catch {
      /* sem armazenamento: fica no claro */
    }
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    apply(next);
    try {
      if (next === "dark") window.localStorage.setItem(KEY, "dark");
      else window.localStorage.removeItem(KEY);
    } catch {
      /* ignora */
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mode === "dark"}
      aria-label="Tema escuro"
      title={mode === "dark" ? "Voltar ao tema claro" : "Usar tema escuro"}
      className="btn icon-btn btn-sm"
      onClick={toggle}
    >
      <Icon mode={mode} />
    </button>
  );
}
