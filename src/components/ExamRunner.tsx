"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Exam } from "@/lib/schema";
import { findExample } from "@/lib/examples";
import {
  allQuestions,
  computeResult,
  countAnswered,
  type Answers,
  type Grades,
} from "@/lib/score";
import {
  loadAttempt,
  loadHistory,
  loadLibrary,
  newAttempt,
  saveAttempt,
  storageAvailable,
  upsertHistory,
  type Attempt,
  type HistoryEntry,
} from "@/lib/storage";
import { downloadJson } from "@/lib/download";
import { McCard, OpenCard } from "./QuestionCard";

type Load =
  | { state: "loading" }
  | { state: "missing" }
  | { state: "ready"; exam: Exam };

export function ExamRunner({ examId }: { examId: string }) {
  const [load, setLoad] = useState<Load>({ state: "loading" });

  useEffect(() => {
    const exam =
      findExample(examId) ?? loadLibrary().find((e) => e.id === examId);
    setLoad(exam ? { state: "ready", exam } : { state: "missing" });
  }, [examId]);

  if (load.state === "loading")
    return (
      <div className="sheet">
        <p>Carregando…</p>
      </div>
    );
  if (load.state === "missing")
    return (
      <div className="sheet">
        <h1 className="page-title">Simulado não encontrado</h1>
        <p className="lead">
          Não achei nenhum banco com o id <code>{examId}</code> neste
          navegador. Se ele foi importado em outro aparelho, importe o arquivo
          JSON de novo.
        </p>
        <Link className="btn btn-primary" href="/importar">
          Importar um JSON
        </Link>{" "}
        <Link className="btn" href="/">
          Voltar à biblioteca
        </Link>
      </div>
    );
  return <Runner exam={load.exam} />;
}

function Runner({ exam }: { exam: Exam }) {
  const [attempt, setAttempt] = useState<Attempt>(() => newAttempt());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [saved, setSaved] = useState<"idle" | "saved" | "error">("idle");
  const [resumed, setResumed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = useMemo(() => allQuestions(exam), [exam]);
  const numberOf = useMemo(() => {
    const m = new Map<string, number>();
    questions.forEach((q, i) => m.set(q.id, i + 1));
    return m;
  }, [questions]);

  // Carrega a tentativa salva (retomada) e o histórico.
  useEffect(() => {
    const ok = storageAvailable();
    setStorageOk(ok);
    const a = loadAttempt(exam.id);
    setAttempt(a);
    setHistory(loadHistory(exam.id));
    setResumed(countAnswered(exam, a.answers) > 0 || a.finished);
    setHydrated(true);
  }, [exam]);

  // Salvamento automático (com pequeno atraso para não gravar a cada tecla).
  useEffect(() => {
    if (!hydrated || !storageOk) return;
    const t = setTimeout(() => {
      setSaved(saveAttempt(exam.id, attempt) ? "saved" : "error");
    }, 250);
    return () => clearTimeout(t);
  }, [attempt, hydrated, storageOk, exam.id]);

  // Garante que nada se perde se a aba for fechada/trocada dentro do atraso acima.
  const latest = useRef(attempt);
  useEffect(() => {
    latest.current = attempt;
  }, [attempt]);
  useEffect(() => {
    if (!hydrated || !storageOk) return;
    const flush = () => {
      saveAttempt(exam.id, latest.current);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
  }, [hydrated, storageOk, exam.id]);

  const result = useMemo(
    () => computeResult(exam, attempt.answers, attempt.grades),
    [exam, attempt.answers, attempt.grades],
  );

  // Depois de finalizada, o histórico acompanha a correção das discursivas.
  useEffect(() => {
    if (!hydrated || !attempt.finished) return;
    const entry: HistoryEntry = {
      attemptId: attempt.attemptId,
      date: attempt.finishedAt ?? attempt.updatedAt,
      hits: result.objective.hits,
      objectiveTotal: result.objective.total,
      objectivePercent: result.objectivePercent,
      earned: result.earned,
      max: result.max,
      percent: result.percent,
      final: result.final,
    };
    upsertHistory(exam.id, entry);
    setHistory(loadHistory(exam.id));
  }, [
    hydrated,
    attempt.finished,
    attempt.attemptId,
    attempt.finishedAt,
    attempt.updatedAt,
    result,
    exam.id,
  ]);

  const answered = countAnswered(exam, attempt.answers);
  const total = questions.length;
  const locked = attempt.finished;

  const setAnswer = useCallback((id: string, value: string) => {
    setAttempt((a) => ({ ...a, answers: { ...a.answers, [id]: value } }));
  }, []);

  const setGrade = useCallback(
    (id: string, g: { points?: number; comment?: string }) => {
      setAttempt((a) => ({ ...a, grades: { ...a.grades, [id]: g } }));
    },
    [],
  );

  function finish() {
    const missing = total - answered;
    if (
      missing > 0 &&
      !window.confirm(
        `Faltam ${missing} questão(ões) sem resposta. Deseja finalizar e corrigir mesmo assim?`,
      )
    )
      return;
    const now = new Date().toISOString();
    setAttempt((a) => ({ ...a, finished: true, finishedAt: now }));
    setTimeout(
      () =>
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      80,
    );
  }

  function reset() {
    if (
      !window.confirm(
        "Apagar as respostas desta tentativa e começar de novo? O histórico de resultados será preservado.",
      )
    )
      return;
    setAttempt(newAttempt());
    setResumed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exportHistory() {
    downloadJson(`historico_${exam.id}.json`, {
      exam: { id: exam.id, title: exam.title },
      exportedAt: new Date().toISOString(),
      history,
    });
  }

  const pct = total ? (answered / total) * 100 : 0;
  const answers: Answers = attempt.answers;
  const grades: Grades = attempt.grades;

  return (
    <article className="sheet">
      <div className="sticky-bar no-print">
        <div className="sticky-row">
          <span>
            <strong>{answered}</strong> de {total} questões respondidas
          </span>
          <span className="save-line" aria-live="polite">
            {!storageOk
              ? "⚠ Sem salvamento neste modo do navegador"
              : saved === "saved"
                ? "✓ Salvo neste aparelho"
                : saved === "error"
                  ? "⚠ Não foi possível salvar"
                  : "Salvamento automático ativo"}
          </span>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Questões respondidas"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answered}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <header className="paper-head">
        {exam.institution && <div className="paper-inst">{exam.institution}</div>}
        <h1 className="paper-title">{exam.title}</h1>
        <div className="paper-sub">
          {[exam.grade, exam.subject].filter(Boolean).join(" • ")}
        </div>
        <div className="paper-fields">
          <div className="paper-field">
            <strong>Nome:</strong>
          </div>
          <div className="paper-field">
            <strong>Data:</strong> ____ / ____ / ______
          </div>
          <div className="paper-field">
            <strong>Tempo:</strong> ______
          </div>
        </div>
      </header>

      {resumed && !locked && (
        <p className="callout no-print">
          Encontramos respostas salvas neste aparelho. Você pode continuar de
          onde parou.
        </p>
      )}

      <div className="callout no-print">
        <strong>Orientações:</strong> leia cada questão com atenção. Nas
        objetivas, marque apenas uma alternativa. Nas discursivas, escreva com
        frases completas e suas próprias palavras. Ao terminar, clique em{" "}
        <em>Finalizar e corrigir</em>. As discursivas devem ser corrigidas por
        um responsável ou professor, com base nos critérios mostrados.
      </div>

      {exam.parts.map((part) => (
        <div key={part.id}>
          <h2 className="part-title">{part.title}</h2>
          {part.questions.map((q) =>
            q.type === "multiple_choice" ? (
              <McCard
                key={q.id}
                q={q}
                number={numberOf.get(q.id) ?? 0}
                answer={answers[q.id]}
                locked={locked}
                onAnswer={(v) => setAnswer(q.id, v)}
              />
            ) : (
              <OpenCard
                key={q.id}
                q={q}
                number={numberOf.get(q.id) ?? 0}
                answer={answers[q.id]}
                locked={locked}
                grade={grades[q.id]}
                onAnswer={(v) => setAnswer(q.id, v)}
                onGrade={(g) => setGrade(q.id, g)}
              />
            ),
          )}
        </div>
      ))}

      {locked && (
        <div className="result" ref={resultRef} aria-live="polite">
          <div className="result-big">
            Objetivas: {result.objective.hits} de {result.objective.total}{" "}
            acertos — {result.objectivePercent}%
          </div>
          {result.objective.unanswered > 0 && (
            <p>
              Você deixou {result.objective.unanswered} questão(ões)
              objetiva(s) sem resposta. As alternativas corretas estão
              destacadas.
            </p>
          )}
          <div className="result-split">
            <div>
              <span className="badge">Correção automática</span>
              <p>
                Objetivas: {result.objective.earned} de {result.objective.max}{" "}
                ponto(s).
              </p>
            </div>
            {result.open.total > 0 && (
              <div>
                <span className="badge badge-warm">Correção assistida</span>
                <p>
                  Discursivas: {result.open.earned} de {result.open.max}{" "}
                  ponto(s).{" "}
                  {result.open.pending > 0
                    ? `${result.open.pending} aguardando correção do responsável.`
                    : "Todas corrigidas."}
                </p>
              </div>
            )}
            <div>
              {result.final ? (
                <>
                  <span className="badge badge-ok">Nota final</span>
                  <p>
                    <strong>
                      {result.earned} de {result.max} pontos — {result.percent}%
                    </strong>
                  </p>
                </>
              ) : (
                <>
                  <span className="badge badge-muted">Nota parcial</span>
                  <p>
                    A nota final só aparece depois de corrigir as{" "}
                    {result.open.pending} discursiva(s) pendente(s).
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="actions no-print">
        <button
          type="button"
          className="btn btn-primary"
          onClick={finish}
          disabled={locked}
        >
          {locked ? "Prova corrigida" : "Finalizar e corrigir"}
        </button>
        <button type="button" className="btn" onClick={reset}>
          Refazer prova
        </button>
        <button type="button" className="btn" onClick={() => window.print()}>
          Imprimir / salvar em PDF
        </button>
      </div>

      <details className="history no-print">
        <summary>Histórico de tentativas neste aparelho ({history.length})</summary>
        {history.length === 0 ? (
          <p className="save-line">Ainda não há tentativas concluídas.</p>
        ) : (
          <>
            <ol>
              {history
                .slice()
                .reverse()
                .map((h) => (
                  <li key={h.attemptId}>
                    {new Date(h.date).toLocaleString("pt-BR")} — objetivas{" "}
                    {h.hits}/{h.objectiveTotal} ({h.objectivePercent}%)
                    {h.final
                      ? ` · nota final ${h.percent}%`
                      : " · discursivas pendentes"}
                  </li>
                ))}
            </ol>
            <button
              type="button"
              className="btn btn-sm"
              onClick={exportHistory}
            >
              Exportar histórico (JSON)
            </button>
          </>
        )}
      </details>
    </article>
  );
}
