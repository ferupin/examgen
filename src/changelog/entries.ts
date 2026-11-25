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
    version: "0.3.0",
    date: "2026-11-24",
    summary: "Biblioteca focada nos seus bancos, catálogo de exemplos do 1º ao 9º ano e formulário mais claro.",
    changes: {
      added: [
        "Catálogo de exemplos: um simulado de 10 questões para cada matéria (Língua Portuguesa, Matemática, Ciências, História, Geografia, Língua Inglesa, Arte, Educação Física e Ensino Religioso), cobrindo do 1º ao 9º ano.",
        "Em Criar com IA, \"Assuntos\" agora é uma lista de etiquetas: adicione com Enter, vírgula ou botão e remova com um clique.",
        "Ícone \"?\" em Referência curricular explicando o que é e como achar a da escola.",
        "Aviso discreto \"Salvo no navegador\" no topo, algum tempo depois da última alteração.",
      ],
      changed: [
        "A tela inicial mostra primeiro os seus bancos; os exemplos ficam num painel que você abre quando quiser (abre sozinho enquanto a biblioteca está vazia).",
        "\"Versões\" saiu da navegação e foi para o rodapé.",
        "Avisos (toasts) aparecem no topo, com fade, e não cobrem mais os botões de baixo.",
        "Campos preenchidos têm fundo mais claro e uma barra de destaque, para diferenciar do vazio.",
        "Nível de dificuldade agora usa botões coloridos (verde, âmbar e vermelho) sempre acompanhados de texto.",
        "O simulado de História do protótipo foi substituído pelo catálogo; as revisões da escola continuam disponíveis em um grupo à parte.",
      ],
      internal: [
        "Etapa de ensino (Fundamental I e II) derivada do campo grade; incluir um banco novo no catálogo é um arquivo JSON mais uma linha no registro.",
        "Testes do catálogo: 10 questões por banco, um por ano de 1 a 9, 4 alternativas, gabarito equilibrado e nenhum aviso de qualidade.",
        "Novos componentes: HelpTip, TagInput e Segmented com tom.",
      ],
    },
  },
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
