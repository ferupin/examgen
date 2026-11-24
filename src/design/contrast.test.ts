import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Lê os valores reais dos tokens em globals.css e confere o contraste dos
 * pares de texto/fundo em AMBOS os temas. Token novo usado como texto ou
 * fundo deve entrar nesta lista.
 */
const css = fs.readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");

function tokens(selector: RegExp): Record<string, string> {
  const block = css.match(selector)?.[1] ?? "";
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
  );
}
const light = tokens(/:root,\s*:root\[data-theme="light"\]\s*\{([^}]*)\}/);
const dark = tokens(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/);

function lum(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** [texto, fundo, mínimo]. 4.5 para texto, 3 para bordas de controles. */
const PAIRS: [string, string, number][] = [
  ["ink", "paper", 4.5],
  ["ink", "desk", 4.5],
  ["ink", "paper-2", 4.5],
  ["muted", "paper", 4.5],
  ["muted", "paper-2", 4.5],
  ["muted", "desk", 4.5],
  ["accent", "paper", 4.5],
  ["accent", "paper-2", 4.5],
  ["accent", "accent-soft", 4.5],
  ["accent-ink", "accent", 4.5],
  ["warm", "warm-soft", 4.5],
  ["warm", "paper", 4.5],
  ["ok", "ok-soft", 4.5],
  ["bad", "bad-soft", 4.5],
  ["bad", "paper", 4.5],
  ["ink", "accent-soft", 4.5],
  ["paper", "warm", 4.5],
  ["paper", "ok", 4.5],
  ["paper", "bad", 4.5],
  ["line-strong", "paper", 1.5],
];

describe.each([
  ["claro", light],
  ["escuro", dark],
])("contraste no tema %s", (_name, theme) => {
  it("tem todos os tokens", () => {
    for (const [a, b] of PAIRS) {
      expect(theme[a], a).toBeDefined();
      expect(theme[b], b).toBeDefined();
    }
  });
  it.each(PAIRS)("%s sobre %s ≥ %s", (a, b, min) => {
    expect(ratio(theme[a], theme[b])).toBeGreaterThanOrEqual(min);
  });
});
