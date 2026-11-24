"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import type { Exam } from "@/lib/schema";
import { exampleExams } from "@/lib/examples";
import { allQuestions, countAnswered } from "@/lib/score";
import {
  loadAttempt,
  loadHistory,
  loadLibrary,
  removeFromLibrary,
} from "@/lib/storage";
import { downloadJson } from "@/lib/download";

interface Status {
  answered: number;
  finished: boolean;
  last?: { percent: number; final: boolean; objectivePercent: number };
}

function ExamCard({
  exam,
  status,
  removable,
  onRemove,
}: {
  exam: Exam;
  status: Status | undefined;
  removable: boolean;
  onRemove: () => void;
}) {
  const qs = allQuestions(exam);
  const open = qs.filter((q) => q.type === "open").length;
  const mc = qs.length - open;
  const started = (status?.answered ?? 0) > 0 && !status?.finished;
  const pct = qs.length ? ((status?.answered ?? 0) / qs.length) * 100 : 0;

  return (
    <div className="card">
      <div className="row">
        <span className="badge">{exam.subject}</span>
        {exam.grade && <span className="badge badge-muted">{exam.grade}</span>}
      </div>
      <h3>{exam.title}</h3>
      <div className="card-meta">
        {mc} objetivas{open > 0 ? ` · ${open} discursivas` : ""} ·{" "}
        {exam.parts.length} {exam.parts.length === 1 ? "parte" : "partes"}
      </div>
      {exam.description && <div className="card-meta">{exam.description}</div>}
      {started && (
        <div>
          <div className="mini-progress" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
          <div className="card-meta">
            Em andamento: {status?.answered} de {qs.length}
          </div>
        </div>
      )}
      {status?.finished && status.last && (
        <div className="card-meta">
          <span
            className={`badge ${status.last.final ? "badge-ok" : "badge-warm"}`}
          >
            {status.last.final
              ? `Nota final ${status.last.percent}%`
              : `Objetivas ${status.last.objectivePercent}% · discursivas pendentes`}
          </span>
        </div>
      )}
      <div className="row card-actions">
        <Link
          className="btn btn-primary btn-sm"
          href={`/prova?id=${encodeURIComponent(exam.id)}`}
        >
          {started ? "Continuar" : status?.finished ? "Ver resultado" : "Começar"}
        </Link>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => downloadJson(`${exam.id}.json`, exam)}
        >
          Baixar JSON
        </button>
        {removable && (
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={onRemove}
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [mine, setMine] = useState<Exam[]>([]);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [ready, setReady] = useState(false);

  function refresh() {
    const lib = loadLibrary();
    setMine(lib);
    const st: Record<string, Status> = {};
    for (const e of [...lib, ...exampleExams]) {
      const a = loadAttempt(e.id);
      const h = loadHistory(e.id);
      const last = h[h.length - 1];
      st[e.id] = {
        answered: countAnswered(e, a.answers),
        finished: a.finished,
        last: last
          ? {
              percent: last.percent,
              final: last.final,
              objectivePercent: last.objectivePercent,
            }
          : undefined,
      };
    }
    setStatus(st);
    setReady(true);
  }

  useEffect(refresh, []);

  function remove(e: Exam) {
    if (
      !window.confirm(
        `Remover "${e.title}" da biblioteca deste aparelho? Baixe o JSON antes se quiser guardá-lo.`,
      )
    )
      return;
    removeFromLibrary(e.id);
    refresh();
  }

  return (
    <div className="sheet">
      <h1 className="page-title">Biblioteca</h1>
      <p className="lead">
        {brand.tagline} Importe um banco em JSON, resolva o simulado e
        guarde o arquivo onde quiser: drive, pendrive ou celular.
      </p>

      <h2 className="section-title">Meus bancos</h2>
      {!ready ? (
        <p>Carregando…</p>
      ) : mine.length === 0 ? (
        <div className="callout">
          Você ainda não importou nenhum banco.{" "}
          <Link href="/importar">Importar um JSON</Link> ou{" "}
          <Link href="/criar">pedir para uma IA criar um</Link>.
        </div>
      ) : (
        <div className="grid">
          {mine.map((e) => (
            <ExamCard
              key={e.id}
              exam={e}
              status={status[e.id]}
              removable
              onRemove={() => remove(e)}
            />
          ))}
        </div>
      )}

      <h2 className="section-title">Exemplos que já acompanham o app</h2>
      <div className="grid">
        {exampleExams.map((e) => (
          <ExamCard
            key={e.id}
            exam={e}
            status={status[e.id]}
            removable={false}
            onRemove={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
