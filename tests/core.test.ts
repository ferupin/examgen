import { describe, expect, it } from "vitest";
import { parseExamJson, validateExam } from "@/lib/schema";
import { computeResult } from "@/lib/score";
import { exampleExams } from "@/lib/examples";
import { templateExam, templateJson } from "@/lib/template";
import historia from "@/data/examples/historia-patrimonio-brasil-5ano.json";
import revisao from "@/data/examples/revisao-historia-iii-trimestre-5ano.json";

describe("schema", () => {
  it("valida os dois bancos de exemplo", () => {
    expect(validateExam(historia).ok).toBe(true);
    expect(validateExam(revisao).ok).toBe(true);
    expect(exampleExams).toHaveLength(2);
  });

  it("conta as questões do protótipo: 30 objetivas + 5 discursivas", () => {
    const r = validateExam(historia);
    if (!r.ok) throw new Error("inválido");
    const qs = r.exam.parts.flatMap((p) => p.questions);
    expect(qs).toHaveLength(35);
    expect(qs.filter((q) => q.type === "open")).toHaveLength(5);
    expect(r.exam.parts).toHaveLength(5);
  });

  it("valida o template entregue à LLM", () => {
    expect(validateExam(templateExam).ok).toBe(true);
  });

  it("aceita JSON com cerca de código (```json)", () => {
    expect(parseExamJson("```json\n" + templateJson + "\n```").ok).toBe(true);
  });

  it("rejeita JSON quebrado com mensagem em português", () => {
    const r = parseExamJson("{ isso não é json");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]).toMatch(/JSON válido/);
  });

  it("rejeita resposta que não existe nas alternativas", () => {
    const bad = structuredClone(templateExam) as any;
    bad.parts[0].questions[0].answer = "z";
    const r = validateExam(bad);
    expect(r.ok).toBe(false);
    if (!r.ok)
      expect(r.errors.join(" ")).toMatch(/Parte 1 › Questão 1 › answer/);
  });

  it("rejeita ids de questão repetidos e tipo desconhecido", () => {
    const dup = structuredClone(templateExam) as any;
    dup.parts[0].questions[1].id = "q01";
    expect(validateExam(dup).ok).toBe(false);
    const t = structuredClone(templateExam) as any;
    t.parts[0].questions[0].type = "vf";
    const r = validateExam(t);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(" ")).toMatch(/tipo de questão inválido/);
  });

  it("avisa quando não há 4 alternativas", () => {
    const t = structuredClone(templateExam) as any;
    t.parts[0].questions[0].options.pop();
    const r = validateExam(t);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.warnings).toHaveLength(1);
  });
});

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
