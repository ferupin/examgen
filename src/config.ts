import pkg from "../package.json";

/**
 * Identidade e links em UM só lugar. O nome ainda é provisório: para trocar
 * depois do MVP, edite aqui (e os tokens de cor em src/app/globals.css).
 * Nenhum outro arquivo escreve o nome do produto à mão.
 */
export const brand = {
  name: "examgen",
  tagline: "Seu banco de questões num arquivo só.",
  /** Prefixo das chaves do localStorage. Mudar o nome da marca NÃO deve mudar isto:
   *  mudar apaga o acesso aos dados já salvos no navegador. */
  storagePrefix: "examgen.v1",
} as const;

/** Versão do formato JSON dos bancos de questões. Promessa estável: ver docs/file-format.md. */
export const schemaVersion = 1 as const;

/** Versão do app (vem do package.json; é a mesma mostrada em /versoes). */
export const appVersion: string = pkg.version;

/** Único lugar com URLs externas. Renomear o repositório é uma linha. */
export const links = {
  repo: "https://github.com/ferupin/examgen",
  issues: "https://github.com/ferupin/examgen/issues/new/choose",
} as const;

/** IAs sugeridas na tela "Criar com IA". A ordem é a da exibição; `recommended` destaca uma. */
export const llms = [
  { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app", recommended: true },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/", recommended: false },
  { id: "claude", name: "Claude", url: "https://claude.ai/new", recommended: false },
] as const;
