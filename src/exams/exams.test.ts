import { describe, expect, it } from "vitest";
import { validateExam } from "@/core/schema";
import { computeResult } from "@/core/score";
import livro04 from "./data/historia-livro04-revisao-escola-5ano.json";

describe("banco Livro 04 + revisão da escola", () => {
  const r = validateExam(livro04);
  if (!r.ok) throw new Error("inválido");
  const qs = r.exam.parts.flatMap((p) => p.questions);

  it("tem 43 objetivas em 6 partes e nenhuma discursiva", () => {
    expect(qs).toHaveLength(43);
    expect(r.exam.parts).toHaveLength(6);
    expect(qs.every((q) => q.type === "multiple_choice")).toBe(true);
  });

  it("gabarito equilibrado: nenhuma letra passa de 30% das respostas", () => {
    const count: Record<string, number> = {};
    for (const q of qs) if (q.type === "multiple_choice") count[q.answer] = (count[q.answer] ?? 0) + 1;
    for (const n of Object.values(count)) expect(n / 43).toBeLessThanOrEqual(0.3);
  });

  it("gabarito perfeito = 43/43 e nota final imediata (sem discursivas)", () => {
    const answers: Record<string, string> = {};
    for (const q of qs) if (q.type === "multiple_choice") answers[q.id] = q.answer;
    const res = computeResult(r.exam, answers, {});
    expect(res.objective.hits).toBe(43);
    expect(res.final).toBe(true);
    expect(res.percent).toBe(100);
  });
});

