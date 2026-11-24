"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { t } from "@/i18n";

type Kind = "success" | "error" | "info";
interface Item {
  id: number;
  kind: Kind;
  text: string;
}
type Push = (kind: Kind, text: string) => void;

const ToastContext = createContext<Push>(() => {});

/** Aviso rápido: sobrepõe a tela, nunca empurra o layout e some sozinho. */
export function useToast(): Push {
  return useContext(ToastContext);
}

const ICON = { success: CircleCheck, error: CircleAlert, info: Info } as const;
const STYLE: Record<Kind, string> = {
  success: "border-ok-line bg-ok-soft text-ok",
  error: "border-bad-line bg-bad-soft text-bad",
  info: "border-line-strong bg-paper-2 text-ink",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback(
    (id: number) => setItems((cur) => cur.filter((i) => i.id !== id)),
    [],
  );
  const push = useCallback<Push>(
    (kind, text) => {
      const id = ++seq.current;
      // No máximo 3 avisos ao mesmo tempo.
      setItems((cur) => [...cur.slice(-2), { id, kind, text }]);
      setTimeout(() => dismiss(id), kind === "error" ? 6000 : 3200);
    },
    [dismiss],
  );

  const stack = createElement(
    "div",
    {
      className:
        "pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 print:hidden",
      "aria-live": "polite",
    },
    items.map((i) => {
      const Icon = ICON[i.kind];
      return (
        <div
          key={i.id}
          role={i.kind === "error" ? "alert" : "status"}
          className={`toast-in pointer-events-auto flex max-w-md items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[15px] font-semibold shadow-sheet ${STYLE[i.kind]}`}
        >
          <Icon size={18} aria-hidden="true" className="flex-none" />
          <span>{i.text}</span>
          <button
            type="button"
            className="-mr-1 grid size-7 flex-none place-items-center rounded-md hover:bg-black/10"
            aria-label={t("toast.close")}
            onClick={() => dismiss(i.id)}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      );
    }),
  );

  const value = useMemo(() => push, [push]);
  return createElement(ToastContext.Provider, { value }, children, stack);
}
