"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("ok");
    } catch {
      setState("err");
    }
    setTimeout(() => setState("idle"), 2200);
  }

  return (
    <button type="button" className="btn btn-primary" onClick={copy}>
      {state === "ok"
        ? "Copiado ✓"
        : state === "err"
          ? "Não deu para copiar — selecione o texto"
          : label}
    </button>
  );
}
