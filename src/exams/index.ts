import { validateExam, type Exam } from "@/core/schema";
import historia from "./data/historia-patrimonio-brasil-5ano.json";
import revisao from "./data/revisao-historia-iii-trimestre-5ano.json";
import livro04 from "./data/historia-livro04-revisao-escola-5ano.json";

/**
 * Registro dos bancos que acompanham o app. Adicionar um banco = um arquivo
 * JSON em ./data + uma linha aqui. Todos são validados na carga; o teste
 * exams.test.ts falha se algum ficar inválido.
 */
const raws: unknown[] = [livro04, revisao, historia];

export const exampleExams: Exam[] = raws.flatMap((raw) => {
  const r = validateExam(raw);
  return r.ok ? [r.exam] : [];
});

export function findExample(id: string): Exam | undefined {
  return exampleExams.find((e) => e.id === id);
}
