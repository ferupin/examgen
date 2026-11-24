import { describe, expect, it } from "vitest";
import {
  buildFixPrompt,
  buildPrompt,
  buildSkeleton,
  CreatorSchema,
  defaultFields,
  missingRequired,
  resetSimulado,
  slugify,
} from "@/lib/prompt";
import { validateExam } from "@/lib/schema";
import { templateExam } from "@/lib/template";

const f = {
  ...defaultFields,
  grade: "5º Ano",
  subject: "História",
  institution: "Colégio X",
  title: "Revisão do 3º Trimestre",
  materials: "Livro 04\nRevisão",
};

describe("prompt", () => {
  it("slugify remove acentos", () => {
    expect(slugify("Revisão do 3º Trimestre!")).toBe("revisao-do-3-trimestre");
  });
  it("esqueleto reflete os campos e valida", () => {
    const sk = buildSkeleton(f);
    expect(sk.id).toBe("revisao-do-3-trimestre-v1");
    expect(sk.grade).toBe("5º Ano");
    expect(sk.sources.providedMaterial).toEqual(["Livro 04", "Revisão"]);
    expect(validateExam(sk).ok).toBe(true);
  });
  it("sem discursivas o esqueleto não traz questão open", () => {
    const sk = buildSkeleton(f);
    expect(sk.parts[0].questions.some((q) => q.type === "open")).toBe(false);
    expect(buildSkeleton({ ...f, openCount: "2" }).parts[0].questions.some((q) => q.type === "open")).toBe(true);
  });
  it("não altera o modelo original", () => {
    buildSkeleton(f);
    expect(templateExam.parts[0].questions.some((q) => q.type === "open")).toBe(true);
  });
  it("pedido de imagens traz o fluxo e as regras", () => {
    const p = buildPrompt(f);
    expect(p).toContain("Pronto, pode enviar as imagens.");
    expect(p).toContain("GERAR");
    expect(p).toContain("NUNCA invente");
    expect(p).toContain("30%");
    expect(p).toContain('"schemaVersion"');
    expect(p.indexOf("# Esqueleto")).toBeGreaterThan(p.indexOf("# Fontes"));
  });
  it("campos faltando viram [PREENCHER]", () => {
    expect(buildPrompt(defaultFields)).toContain("[PREENCHER: série ou ano]");
    expect(missingRequired(defaultFields)).toEqual(["série ou ano", "disciplina"]);
    expect(missingRequired(f)).toEqual([]);
  });
  it("novo simulado mantém aluno e escola", () => {
    const r = resetSimulado({ ...f, topics: "x" });
    expect(r.grade).toBe("5º Ano");
    expect(r.subject).toBe("");
    expect(r.topics).toBe("");
  });
  it("dados salvos estragados voltam ao padrão", () => {
    const r = CreatorSchema.parse({ grade: 5, inputMode: "zzz", allowExternal: "x" });
    expect(r.grade).toBe("");
    expect(r.inputMode).toBe("images");
    expect(r.allowExternal).toBe(false);
  });
  it("pedido de correção lista os erros", () => {
    expect(buildFixPrompt(["a", "b"])).toContain("- b");
  });
});

describe("avisos de equilíbrio", () => {
  const mc = (i: number, answer: string, longest: boolean) => ({
    id: `q${i}`,
    type: "multiple_choice" as const,
    prompt: "p",
    options: ["a", "b", "c", "d"].map((id) => ({
      id,
      text: id === answer && longest ? "texto bem mais longo aqui" : "curto",
    })),
    answer,
    explanation: "e",
  });
  const exam = (qs: ReturnType<typeof mc>[]) => ({
    ...templateExam,
    parts: [{ id: "p1", title: "P", questions: qs }],
  });
  it("avisa gabarito concentrado e correta mais longa", () => {
    const qs = Array.from({ length: 10 }, (_, i) => mc(i + 1, "a", true));
    const r = validateExam(exam(qs));
    expect(r.ok && r.warnings.length).toBe(2);
  });
  it("não avisa quando equilibrado", () => {
    const qs = Array.from({ length: 12 }, (_, i) => mc(i + 1, "abcd"[i % 4], false));
    const r = validateExam(exam(qs));
    expect(r.ok && r.warnings.length).toBe(0);
  });
});
