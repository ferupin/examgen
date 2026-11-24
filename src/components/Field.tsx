import type { ReactNode } from "react";

/** Rótulo + controle. O controle fica dentro do <label>, então o clique e o leitor de tela já ficam ligados. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {hint && <span className="field-hint"> {hint}</span>}
      </span>
      {children}
    </label>
  );
}
