"use client";

import type { McQuestion, OpenQuestion } from "@/lib/schema";
import { isAnswered } from "@/lib/score";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Rubrica padrão do projeto (0–3). Não é uma escala oficial da BNCC nem da escola. */
const RUBRIC_3 = [
  "0 — Não respondeu ou respondeu de forma incorreta.",
  "1 — Compreensão parcial: faltaram conceitos importantes.",
  "2 — Respondeu corretamente com os conceitos principais.",
  "3 — Resposta completa, correta e bem explicada, com detalhes pertinentes.",
];

function Table({ table }: { table: NonNullable<McQuestion["table"]> }) {
  const hasHeader = table.headers.some((h) => h.trim() !== "");
  return (
    <div className="table-wrap">
      <table>
        {table.caption && <caption>{table.caption}</caption>}
        {hasHeader && (
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th key={i} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Head({
  number,
  title,
  kind,
}: {
  number: number;
  title?: string;
  kind: "auto" | "assisted";
}) {
  return (
    <div className="q-head">
      <span className="q-num">{number}.</span>
      {title && <span className="q-title">{title}</span>}
      <span className="q-kind">
        {kind === "auto" ? (
          <span className="badge">Correção automática</span>
        ) : (
          <span className="badge badge-warm">Correção assistida</span>
        )}
      </span>
    </div>
  );
}

export function McCard({
  q,
  number,
  answer,
  locked,
  onAnswer,
}: {
  q: McQuestion;
  number: number;
  answer: string | undefined;
  /** Prova já corrigida: trava respostas e mostra gabarito/explicação. */
  locked: boolean;
  onAnswer: (id: string) => void;
}) {
  return (
    <section className="question" aria-labelledby={`q-${q.id}`}>
      <Head number={number} title={q.title} kind="auto" />
      {q.context && <p className="q-context">{q.context}</p>}
      {q.table && <Table table={q.table} />}
      <p className="q-prompt" id={`q-${q.id}`}>
        {q.prompt}
      </p>
      {q.statements && (
        <div className="statements">
          {q.statements.map((s, i) => (
            <div key={i}>
              <span className="roman">{ROMAN[i] ?? i + 1}.</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
      <div className="options" role="radiogroup" aria-labelledby={`q-${q.id}`}>
        {q.options.map((o) => {
          const selected = answer === o.id;
          const isCorrect = locked && o.id === q.answer;
          const isWrong = locked && selected && o.id !== q.answer;
          const cls = [
            "option",
            selected ? "selected" : "",
            locked ? "locked" : "",
            isCorrect ? "correct" : "",
            isWrong ? "wrong" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <label key={o.id} className={cls}>
              <input
                type="radio"
                name={q.id}
                value={o.id}
                checked={selected}
                disabled={locked}
                onChange={() => onAnswer(o.id)}
              />
              <span className="opt-letter" aria-hidden="true">
                {o.id.toUpperCase()}
              </span>
              <span>{o.text}</span>
              {isCorrect && <span className="opt-flag">✓ Correta</span>}
              {isWrong && <span className="opt-flag">✗ Sua resposta</span>}
            </label>
          );
        })}
      </div>
      {locked && (
        <div className="feedback">
          <strong>
            {!answer
              ? "Sem resposta. Explicação:"
              : answer === q.answer
                ? "Você acertou! Explicação:"
                : "Explicação:"}
          </strong>
          {q.explanation}
        </div>
      )}
    </section>
  );
}

export function OpenCard({
  q,
  number,
  answer,
  locked,
  grade,
  onAnswer,
  onGrade,
}: {
  q: OpenQuestion;
  number: number;
  answer: string | undefined;
  locked: boolean;
  grade: { points?: number; comment?: string } | undefined;
  onAnswer: (text: string) => void;
  onGrade: (g: { points?: number; comment?: string }) => void;
}) {
  const answered = isAnswered(q, answer ? { [q.id]: answer } : {});
  const points = Array.from({ length: q.maxPoints + 1 }, (_, i) => i);

  return (
    <section className="question" aria-labelledby={`q-${q.id}`}>
      <Head number={number} title={q.title} kind="assisted" />
      {q.context && <p className="q-context">{q.context}</p>}
      {q.table && <Table table={q.table} />}
      <p className="q-prompt" id={`q-${q.id}`}>
        {q.prompt}
      </p>
      <textarea
        aria-labelledby={`q-${q.id}`}
        placeholder="Escreva sua resposta com frases completas…"
        value={answer ?? ""}
        disabled={locked}
        onChange={(e) => onAnswer(e.target.value)}
      />

      {locked && (
        <>
          <div className="expected">
            <h4>Resposta esperada (modelo)</h4>
            <div>{q.expectedAnswer}</div>
            {q.keyConcepts.length > 0 && (
              <>
                <h4>Conceitos essenciais</h4>
                <ul>
                  {q.keyConcepts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}
            <h4>Critérios de avaliação</h4>
            <ul>
              {q.criteria.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {!answered ? (
            <p className="callout callout-warn">
              <span className="badge badge-muted">Sem resposta</span> Vale 0
              ponto (não respondeu).
            </p>
          ) : (
            <fieldset className="grader">
              <legend>
                Correção do responsável{" "}
                {grade?.points !== undefined ? (
                  <span className="badge badge-ok">
                    Corrigida: {grade.points}/{q.maxPoints}
                  </span>
                ) : (
                  <span className="badge badge-warm">
                    Aguardando correção
                  </span>
                )}
              </legend>
              <div className="rubric-btns" role="radiogroup" aria-label="Pontuação">
                {points.map((p) => (
                  <label key={p}>
                    <input
                      type="radio"
                      name={`grade-${q.id}`}
                      checked={grade?.points === p}
                      onChange={() =>
                        onGrade({ points: p, comment: grade?.comment })
                      }
                    />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
              <p className="rubric-hint">
                {q.maxPoints === 3 ? (
                  <>
                    Rubrica do projeto (não é uma escala oficial da BNCC nem da
                    escola):
                    <br />
                    {RUBRIC_3.map((r) => (
                      <span key={r}>
                        {r}
                        <br />
                      </span>
                    ))}
                  </>
                ) : (
                  <>Pontuação de 0 a {q.maxPoints}.</>
                )}
              </p>
              <label>
                <span className="rubric-hint">Comentário (opcional)</span>
                <textarea
                  style={{ minHeight: 70 }}
                  value={grade?.comment ?? ""}
                  placeholder="Ex.: Citou o incêndio, mas faltou explicar por que a perda é importante."
                  onChange={(e) =>
                    onGrade({
                      points: grade?.points,
                      comment: e.target.value,
                    })
                  }
                />
              </label>
              {grade?.points === undefined && (
                <p className="rubric-hint">
                  Escolha uma nota para finalizar esta questão.
                </p>
              )}
            </fieldset>
          )}
        </>
      )}
    </section>
  );
}
