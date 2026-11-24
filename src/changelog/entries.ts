/**
 * Histórico de versões como dado tipado. A tela /versoes e o teste de
 * consistência leem daqui, e cada versão também tem uma seção em
 * docs/CHANGELOG.md. Versão nova = uma entrada no TOPO desta lista.
 *
 * Os textos ficam em português (único idioma por enquanto). Ao adicionar
 * outro idioma, troque `string` por um registro por idioma e o teste de
 * completude passa a exigir todos.
 */
export type ChangeKind = "added" | "changed" | "fixed" | "data" | "internal";

export interface ChangelogEntry {
  /** Semântica X.Y.Z: função nova = Y, correção = Z, quebra = X. */
  version: string;
  /** AAAA-MM-DD. */
  date: string;
  /** Uma frase com o que a versão entrega. */
  summary: string;
  changes: Partial<Record<ChangeKind, string[]>>;
}

export const kindOrder: ChangeKind[] = ["added", "changed", "fixed", "data", "internal"];

export const entries: ChangelogEntry[] = [
  {
    version: "0.2.0",
    date: "2026-11-24",
    summary: "Criar com IA por formulário, tema claro por padrão e nova base visual.",
    changes: {
      added: [
        "Criar com IA: campos para aluno, escola e simulado; o pedido para a IA é montado enquanto você digita e fica salvo no navegador.",
        "Pedido pronto para qualquer IA entender que você só enviará imagens (ou texto) e que ela deve devolver um único JSON.",
        "Validação dos campos com asterisco de obrigatório, destaque em vermelho e mensagem clara.",
        "Atalhos para Gemini, ChatGPT e Claude no fim da tela de criação.",
        "Botão para copiar um pedido de correção quando a importação encontra erros.",
        "Avisos na importação quando o gabarito está concentrado em uma letra ou a correta é sempre a mais longa.",
        "Confirmações em modal acessível e avisos rápidos (toasts) no lugar das caixas do navegador.",
        "Página de versões e mudanças.",
      ],
      changed: [
        "Tema claro (creme) por padrão, com troca apenas entre claro e escuro; o app não segue mais o tema do sistema.",
        "Interface reescrita com Tailwind CSS, ícones consistentes e layout fluido de celular a desktop.",
        "Fonte Atkinson Hyperlegible agora é carregada junto com o app, sem pedir nada a servidores externos.",
      ],
      internal: [
        "Código reorganizado em core (lógica pura), storage, exams, features, components, i18n e changelog.",
        "Estado da prova em um store Zustand por prova; cada questão só se redesenha quando a própria resposta muda.",
        "Tentativas e histórico lidos do navegador passam por validação Zod.",
        "Textos da interface num dicionário tipado; testes ao lado do código.",
        "Exportação estática (output export) ligada.",
      ],
    },
  },
  {
    version: "0.1.0",
    date: "2026-11-23",
    summary: "Primeira versão: importar, resolver e corrigir simulados a partir de um JSON.",
    changes: {
      added: [
        "Importar e exportar bancos de questões em JSON (formato versão 1) com validação em português.",
        "Prova em uma página com progresso, salvamento automático e retomada.",
        "Correção automática das objetivas e correção assistida das discursivas, sem nota final enquanto houver correção pendente.",
        "Histórico das últimas 30 tentativas, com exportação em JSON.",
        "Tema claro e escuro.",
        "Impressão básica.",
      ],
      data: [
        "Três bancos de exemplo de História do 5º ano, incluindo o da revisão da escola com 43 questões.",
      ],
    },
  },
];
