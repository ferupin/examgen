"use client";

import { CircleAlert, CircleCheck, FileJson, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { buildFixPrompt } from "@/core/prompt";
import { parseExamJson, type Exam } from "@/core/schema";
import { allQuestions } from "@/core/score";
import { t } from "@/i18n";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/ToastProvider";
import { saveToLibrary } from "@/storage/library";

type Parsed =
  | { kind: "none" }
  | { kind: "error"; errors: string[] }
  | { kind: "ok"; exam: Exam; warnings: string[] };

const MAX_FILE = 5 * 1024 * 1024;

export function ImporterPage() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<Parsed>({ kind: "none" });
  const [saved, setSaved] = useState(false);
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  function analyze(source: string) {
    setText(source);
    setSaved(false);
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
    if (file.size > MAX_FILE) {
      toast("error", t("importer.tooBig"));
      return;
    }
    analyze(await file.text());
    toast("info", t("toast.fileRead"));
  }

  function save() {
    if (parsed.kind !== "ok") return;
    const ok = saveToLibrary(parsed.exam);
    setSaved(ok);
    toast(ok ? "success" : "error", t(ok ? "toast.saved" : "toast.saveFailed"));
  }

  const qs = parsed.kind === "ok" ? allQuestions(parsed.exam) : [];
  const open = qs.filter((q) => q.type === "open").length;

  return (
    <div className="sheet">
      <h1 className="page-title">{t("importer.title")}</h1>
      <p className="lead">
        {t("importer.lead")} <Link href="/criar">{t("importer.leadLink")}</Link>
      </p>

      <div
        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          over ? "border-accent bg-accent-soft" : "border-line-strong bg-paper-2"
        }`}
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
        <FileJson size={32} aria-hidden="true" className="mx-auto mb-2 text-muted" />
        <p className="mb-3">{t("importer.drop")}</p>
        <button type="button" className="btn btn-primary" onClick={() => fileRef.current?.click()}>
          <Upload size={18} aria-hidden="true" />
          {t("importer.choose")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="sr-only"
          aria-label={t("importer.chooseLabel")}
          onChange={(e) => {
            void readFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      <h2 className="section-title">{t("importer.pasteTitle")}</h2>
      <textarea
        className="input min-h-44 font-mono text-[13px] leading-normal"
        aria-label={t("importer.pasteLabel")}
        aria-invalid={parsed.kind === "error"}
        placeholder='{ "schemaVersion": 1, "id": "…", … }'
        value={text}
        onChange={(e) => analyze(e.target.value)}
        spellCheck={false}
      />

      {parsed.kind === "error" && (
        <div className="callout callout-bad" role="alert">
          <strong className="flex items-center gap-1.5">
            <CircleAlert size={18} aria-hidden="true" />
            {t("importer.errorsTitle")}
          </strong>
          <ul className="mt-1.5 list-disc pl-5">
            {parsed.errors.slice(0, 25).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          {parsed.errors.length > 25 && (
            <p>{t("importer.errorsMore", { n: parsed.errors.length - 25 })}</p>
          )}
          <p className="my-2">{t("importer.errorsTip")}</p>
          <CopyButton
            text={buildFixPrompt(parsed.errors.slice(0, 25))}
            label={t("importer.copyFix")}
            successMessage={t("toast.fixCopied")}
            primary={false}
          />
        </div>
      )}

      {parsed.kind === "ok" && (
        <div className="callout" role="status">
          <strong className="flex items-center gap-1.5">
            <CircleCheck size={18} aria-hidden="true" className="text-ok" />
            {t("importer.valid")} {parsed.exam.title}
          </strong>
          <p>
            {t("importer.summary", {
              objective: qs.length - open,
              open,
              parts: t(parsed.exam.parts.length === 1 ? "common.partOne" : "common.partMany", {
                n: parsed.exam.parts.length,
              }),
            })}
          </p>
          {parsed.warnings.length > 0 && (
            <ul className="mt-1.5 list-disc pl-5">
              {parsed.warnings.map((w, i) => (
                <li key={i}>{t("importer.warning", { text: w })}</li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <button type="button" className="btn btn-primary" onClick={save}>
              <Save size={18} aria-hidden="true" />
              {t("importer.save")}
            </button>
            {saved && (
              <>
                <span className="badge badge-ok">{t("importer.savedBadge")}</span>
                <Link className="btn" href={`/prova?id=${encodeURIComponent(parsed.exam.id)}`}>
                  {t("importer.openNow")}
                </Link>
              </>
            )}
          </div>
          <p className="mt-2 text-[13px] text-muted">{t("importer.replaceNote")}</p>
        </div>
      )}
    </div>
  );
}
