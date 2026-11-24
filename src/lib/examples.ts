import { validateExam, type Exam } from "./schema";
import historia from "@/data/examples/historia-patrimonio-brasil-5ano.json";
import revisao from "@/data/examples/revisao-historia-iii-trimestre-5ano.json";

/** Bancos que já acompanham o app. Validados na carga (erros são ignorados). */
export const exampleExams: Exam[] = [revisao, historia].flatMap((raw) => {
  const r = validateExam(raw);
  return r.ok ? [r.exam] : [];
});

export function findExample(id: string): Exam | undefined {
  return exampleExams.find((e) => e.id === id);
}
