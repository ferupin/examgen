import { brand } from "./brand";
import { validateExam, type Exam } from "./schema";
import type { Answers, Grades } from "./score";

/**
 * Persistência 100% local (localStorage). Sem backend, sem banco de dados.
 * Tudo é tratado com try/catch: em modo privado ou com o armazenamento
 * bloqueado o app continua funcionando, apenas sem salvar.
 */

const P = brand.storagePrefix;
const LIBRARY_KEY = `${P}.library`;
const attemptKey = (examId: string) => `${P}.attempt.${examId}`;
const historyKey = (examId: string) => `${P}.history.${examId}`;

export const HISTORY_LIMIT = 30;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function storageAvailable(): boolean {
  try {
    const k = `${P}.__test`;
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

/* ---------------- Biblioteca (bancos importados) ---------------- */

export function loadLibrary(): Exam[] {
  const raw = read<unknown[]>(LIBRARY_KEY, []);
  const exams: Exam[] = [];
  for (const item of Array.isArray(raw) ? raw : []) {
    const r = validateExam(item);
    if (r.ok) exams.push(r.exam);
  }
  return exams;
}

/** Adiciona ou substitui (mesmo id) um banco na biblioteca. */
export function saveToLibrary(exam: Exam): boolean {
  const lib = loadLibrary().filter((e) => e.id !== exam.id);
  lib.push(exam);
  return write(LIBRARY_KEY, lib);
}

export function removeFromLibrary(examId: string): boolean {
  return write(
    LIBRARY_KEY,
    loadLibrary().filter((e) => e.id !== examId),
  );
}

/* ---------------- Tentativa em andamento ---------------- */

export interface Attempt {
  /** Identifica a tentativa (momento em que começou). */
  attemptId: string;
  answers: Answers;
  grades: Grades;
  finished: boolean;
  finishedAt?: string;
  updatedAt: string;
}

export function newAttempt(): Attempt {
  const now = new Date().toISOString();
  return {
    attemptId: now,
    answers: {},
    grades: {},
    finished: false,
    updatedAt: now,
  };
}

export function loadAttempt(examId: string): Attempt {
  const a = read<Partial<Attempt> | null>(attemptKey(examId), null);
  if (!a || typeof a !== "object") return newAttempt();
  const base = newAttempt();
  return {
    ...base,
    ...a,
    answers: a.answers ?? {},
    grades: a.grades ?? {},
    finished: Boolean(a.finished),
  } as Attempt;
}

export function saveAttempt(examId: string, attempt: Attempt): boolean {
  return write(attemptKey(examId), {
    ...attempt,
    updatedAt: new Date().toISOString(),
  });
}

/* ---------------- Histórico (últimas 30 tentativas) ---------------- */

export interface HistoryEntry {
  attemptId: string;
  date: string;
  hits: number;
  objectiveTotal: number;
  objectivePercent: number;
  earned: number;
  max: number;
  /** % geral; só definitivo se final === true. */
  percent: number;
  final: boolean;
}

export function loadHistory(examId: string): HistoryEntry[] {
  const h = read<HistoryEntry[]>(historyKey(examId), []);
  return Array.isArray(h) ? h : [];
}

/** Insere ou atualiza (mesmo attemptId) e mantém só as últimas 30. */
export function upsertHistory(examId: string, entry: HistoryEntry): boolean {
  const h = loadHistory(examId).filter((x) => x.attemptId !== entry.attemptId);
  h.push(entry);
  h.sort((a, b) => a.date.localeCompare(b.date));
  return write(historyKey(examId), h.slice(-HISTORY_LIMIT));
}
