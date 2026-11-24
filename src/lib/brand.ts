/**
 * Identidade da marca em UM só lugar.
 *
 * O nome ainda é provisório. Para trocar depois do MVP: edite este arquivo
 * (e as variáveis de cor em src/app/globals.css). Nenhum outro arquivo
 * contém o nome do produto escrito à mão.
 */
export const brand = {
  /** Nome de exibição (provisório). */
  name: "examgen",
  /** Frase curta sob o logo. */
  tagline: "Seu banco de questões num arquivo só.",
  /** Prefixo das chaves do localStorage. Mudar o nome da marca NÃO precisa mudar isto
   *  (mudar apaga o acesso aos dados já salvos no navegador). */
  storagePrefix: "examgen.v1",
  /** Versão do formato JSON aceito pelo app. */
  schemaVersion: 1 as const,
};
