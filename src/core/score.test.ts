import { describe, expect, it } from "vitest";
import { validateExam } from "./schema";
import { computeResult } from "./score";
import historia from "@/exams/data/historia-patrimonio-brasil-5ano.json";

describe("pontuação", () => {
  const r = validateExam(historia);
  if (!r.ok) throw new Error("inválido");
  const exam = r.exam;
  const qs = exam.parts.flatMap((p) => p.questions);

  it("gabarito perfeito nas objetivas = 30/30, mas NÃO é final com discursivas pendentes", () => {
    const answers: Record<string, string> = {};
    for (const q of qs) {
      answers[q.id] = q.type === "multiple_choice" ? q.answer : "resposta do aluno";
    }
    const res = computeResult(exam, answers, {});
    expect(res.objective.hits).toBe(30);
    expect(res.objectivePercent).toBe(100);
    expect(res.open.pending).toBe(5);
    expect(res.final).toBe(false);
  });

  it("vira final e soma os pontos quando as 5 discursivas são corrigidas", () => {
    const answers: Record<string, string> = {};
    const grades: Record<string, { points: number }> = {};
    for (const q of qs) {
      if (q.type === "multiple_choice") answers[q.id] = q.answer;
      else {
        answers[q.id] = "texto";
        grades[q.id] = { points: 3 };
      }
    }
    const res = computeResult(exam, answers, grades);
    expect(res.final).toBe(true);
    expect(res.earned).toBe(45);
    expect(res.percent).toBe(100);
  });

  it("discursiva em branco vale 0 e não fica pendente", () => {
    const res = computeResult(exam, {}, {});
    expect(res.open.pending).toBe(0);
    expect(res.final).toBe(true);
    expect(res.earned).toBe(0);
    expect(res.objective.unanswered).toBe(30);
  });

  it("limita a nota da discursiva ao máximo da rubrica", () => {
    const open = qs.find((q) => q.type === "open")!;
    const res = computeResult(exam, { [open.id]: "x" }, { [open.id]: { points: 99 } });
    expect(res.open.earned).toBe(3);
  });
});
