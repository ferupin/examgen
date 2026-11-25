import { describe, expect, it } from "vitest";
import { validateExam } from "@/core/schema";
import { computeResult } from "@/core/score";
import livro04 from "./school/historia-livro04-revisao-escola-5ano.json";

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


import { catalogByStage, catalogExams, exampleExams, findExample, schoolExams } from "./index";
import { yearOf } from "@/core/stage";
import { allQuestions } from "@/core/score";

describe("catálogo de exemplos", () => {
  it("tem um banco por matéria padrão, todos carregados", () => {
    expect(catalogExams).toHaveLength(9);
    expect(schoolExams).toHaveLength(2);
    expect(exampleExams).toHaveLength(11);
    const subjects = catalogExams.map((e) => e.subject);
    expect(new Set(subjects).size).toBe(9);
    for (const s of ["Língua Portuguesa", "Matemática", "Ciências", "História", "Geografia", "Arte", "Educação Física", "Língua Inglesa", "Ensino Religioso"])
      expect(subjects).toContain(s);
  });
  it("cobre cada ano do 1º ao 9º", () => {
    expect(catalogExams.map((e) => yearOf(e.grade))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it("cada banco tem exatamente 10 questões", () => {
    for (const e of catalogExams) expect(allQuestions(e), e.id).toHaveLength(10);
  });
  it("ids únicos e achados pelo registro", () => {
    const ids = exampleExams.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(findExample(id)?.id).toBe(id);
  });
  it("objetivas têm 4 alternativas e o gabarito é equilibrado", () => {
    for (const e of catalogExams) {
      const mcs = allQuestions(e).filter((q) => q.type === "multiple_choice");
      const count: Record<string, number> = {};
      for (const q of mcs) {
        expect(q.options, `${e.id} ${q.id}`).toHaveLength(4);
        count[q.answer] = (count[q.answer] ?? 0) + 1;
      }
      expect(Math.max(...Object.values(count)), e.id).toBeLessThanOrEqual(3);
    }
  });
  it("não geram avisos de qualidade na importação", () => {
    for (const e of catalogExams) {
      const r = validateExam(e);
      expect(r.ok && r.warnings, e.id).toEqual([]);
    }
  });
  it("agrupa em Fundamental I (5 bancos) e II (4 bancos)", () => {
    const g = catalogByStage();
    expect(g.map((x) => [x.stage, x.exams.length])).toEqual([["fundamental-1", 5], ["fundamental-2", 4]]);
  });
  it("há questões discursivas para demonstrar a correção assistida", () => {
    const open = catalogExams.flatMap((e) => allQuestions(e)).filter((q) => q.type === "open");
    expect(open.length).toBeGreaterThanOrEqual(3);
  });
});
