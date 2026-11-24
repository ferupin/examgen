"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { parseExamJson, type Exam } from "@/lib/schema";
import { allQuestions } from "@/lib/score";
import { saveToLibrary } from "@/lib/storage";
import { buildFixPrompt } from "@/lib/prompt";
import { CopyButton } from "@/components/CopyButton";

type Parsed =
  | { kind: "none" }
  | { kind: "error"; errors: string[] }
  | { kind: "ok"; exam: Exam; warnings: string[] };

export default function ImportPage() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<Parsed>({ kind: "none" });
  const [saved, setSaved] = useState<"idle" | "ok" | "fail">("idle");
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function analyze(source: string) {
    setText(source);
    setSaved("idle");
    if (!source.trim()) return setParsed({ kind: "none" });
    const r = parseExamJson(source);
    setParsed(
      r.ok
        ? { kind: "ok", exam: r.exam, warnings: r.warnings }
        : { kind: "error", errors: r.errors },
    );
  }

  async function readFile(file: File | undefined) {
    if (!file) return;
    analyze(await file.text());
  }

  function save() {
    if (parsed.kind !== "ok") return;
    setSaved(saveToLibrary(parsed.exam) ? "ok" : "fail");
  }

  const qs = parsed.kind === "ok" ? allQuestions(parsed.exam) : [];
  const open = qs.filter((q) => q.type === "open").length;

  return (
    <div className="sheet">
      <h1 className="page-title">Importar banco de questões</h1>
      <p className="lead">
        Envie o arquivo <code>.json</code> ou cole o texto. O app confere o
        formato antes de guardar. Ainda não tem um arquivo?{" "}
        <Link href="/criar">Veja como pedir para uma IA criar.</Link>
      </p>

      <div
        className={`dropzone${over ? " over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void readFile(e.dataTransfer.files[0]);
        }}
      >
        <p style={{ margin: "0 0 12px" }}>Arraste o arquivo JSON até aqui</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => fileRef.current?.click()}
        >
          Escolher arquivo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          aria-label="Escolher arquivo JSON"
          onChange={(e) => {
            void readFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <h2 className="section-title">…ou cole o JSON</h2>
      <textarea
        className="mono"
        style={{ minHeight: 180 }}
        aria-label="Cole aqui o JSON do simulado"
        placeholder='{ "schemaVersion": 1, "id": "…", … }'
        value={text}
        onChange={(e) => analyze(e.target.value)}
        spellCheck={false}
      />

      {parsed.kind === "error" && (
        <div className="callout callout-bad" role="alert">
          <strong>O arquivo tem problemas. Corrija e tente de novo:</strong>
          <ul>
            {parsed.errors.slice(0, 25).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          {parsed.errors.length > 25 && (
            <p>…e mais {parsed.errors.length - 25} problema(s).</p>
          )}
          <p>Dica: copie o pedido de correção e cole na mesma conversa da IA.</p>
          <CopyButton
            text={buildFixPrompt(parsed.errors.slice(0, 25))}
            label="Copiar pedido de correção para a IA"
          />
        </div>
      )}

      {parsed.kind === "ok" && (
        <div className="callout" role="status">
          <strong>✓ Arquivo válido:</strong> {parsed.exam.title}
          <br />
          {qs.length - open} objetivas · {open} discursivas ·{" "}
          {parsed.exam.parts.length}{" "}
          {parsed.exam.parts.length === 1 ? "parte" : "partes"}
          {parsed.warnings.length > 0 && (
            <ul>
              {parsed.warnings.map((w, i) => (
                <li key={i}>Aviso: {w}</li>
              ))}
            </ul>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button type="button" className="btn btn-primary" onClick={save}>
              Salvar na biblioteca
            </button>
            {saved === "ok" && (
              <>
                <span className="badge badge-ok">Salvo ✓</span>
                <Link
                  className="btn"
                  href={`/prova?id=${encodeURIComponent(parsed.exam.id)}`}
                >
                  Abrir agora
                </Link>
              </>
            )}
            {saved === "fail" && (
              <span className="badge badge-bad">
                Não foi possível salvar (armazenamento bloqueado ou cheio)
              </span>
            )}
          </div>
          <p className="save-line">
            Se já existir um banco com o mesmo id, ele será substituído.
          </p>
        </div>
      )}
    </div>
  );
}
