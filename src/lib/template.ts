import { brand } from "./brand";

/** Esqueleto mínimo e VÁLIDO: serve de exemplo para a LLM e para download. */
export const templateExam = {
  schemaVersion: brand.schemaVersion,
  id: "historia-5ano-exemplo-v1",
  title: "Simulado de História — Exemplo",
  subject: "História",
  grade: "5º Ano do Ensino Fundamental I",
  institution: "Nome da escola (opcional)",
  description: "Descrição curta do que o simulado cobre (opcional).",
  sources: {
    providedMaterial: ["Capítulo X do livro didático, páginas Y–Z"],
    onlyProvidedMaterial: true,
    external: [],
    notes: "Declare aqui se usou só o material fornecido. Não invente fontes.",
  },
  parts: [
    {
      id: "parte-1",
      title: "Título da parte temática",
      questions: [
        {
          type: "multiple_choice",
          id: "q01",
          title: "Título curto da questão",
          context:
            "Situação do cotidiano ou definição em uma ou duas frases (opcional).",
          prompt: "Pergunta clara e direta?",
          options: [
            { id: "a", text: "Alternativa plausível, mas incorreta." },
            { id: "b", text: "Alternativa correta." },
            { id: "c", text: "Alternativa plausível, mas incorreta." },
            { id: "d", text: "Alternativa plausível, mas incorreta." },
          ],
          answer: "b",
          explanation: "Por que a alternativa B está correta, em linguagem simples.",
          points: 1,
        },
        {
          type: "multiple_choice",
          id: "q02",
          title: "Análise de afirmativas",
          prompt: "Analise as afirmativas:",
          statements: [
            "Primeira afirmativa.",
            "Segunda afirmativa.",
            "Terceira afirmativa.",
            "Quarta afirmativa.",
          ],
          options: [
            { id: "a", text: "Apenas I e II estão corretas." },
            { id: "b", text: "Apenas II e III estão corretas." },
            { id: "c", text: "Apenas I, II e IV estão corretas." },
            { id: "d", text: "Todas estão corretas." },
          ],
          answer: "c",
          explanation: "Explique qual afirmativa está errada e por quê.",
          points: 1,
        },
        {
          type: "open",
          id: "q03",
          title: "Questão discursiva",
          prompt: "Explique com suas palavras...",
          expectedAnswer: "Modelo de resposta completa para o responsável comparar.",
          keyConcepts: ["conceito essencial 1", "conceito essencial 2"],
          criteria: [
            "Apresenta informações corretas.",
            "Explica a importância ou o motivo.",
            "Usa as próprias palavras, em frases completas.",
          ],
          maxPoints: 3,
        },
      ],
    },
  ],
};

export const templateJson = JSON.stringify(templateExam, null, 2);

/**
 * Prompt para o responsável colar numa LLM (ChatGPT, Claude, Gemini...).
 * Depois ele informa o conteúdo/matéria e recebe o JSON para importar.
 */
export const llmPrompt = `Você vai criar um simulado escolar interativo como um ARQUIVO JSON, seguindo EXATAMENTE o esqueleto abaixo. Responda apenas com o JSON (pode usar um bloco de código), sem texto extra.

# Perfil do aluno
- Idade/série: [ex.: 11 anos, 5º ano do Ensino Fundamental I]
- Escola/cidade: [opcional]
- Use a BNCC como referência de adequação curricular. O conteúdo específico vem do MATERIAL que eu enviar (fotos, capítulos, resumos, lista de conteúdos e revisões da escola). Não contradiga esse material nem invente informações.

# Como elaborar as questões
1. Levante todos os assuntos, conceitos, datas, personagens e exemplos do material.
2. Agrupe em partes temáticas (campo "parts").
3. Ajuste a linguagem e a profundidade à série. Linguagem clara, acolhedora e educativa, sem pegadinhas nem vocabulário técnico excessivo.
4. Defina quantas questões forem necessárias para cobrir o conteúdo de forma equilibrada (a referência é ~20, mas pode ser 30, 35 ou mais).
5. Construa gabarito, explicações e critérios ANTES de entregar.
6. Revise: precisão, clareza, dificuldade, cobertura e adequação etária.

# Estilo das questões (padrão das revisões escolares)
- Múltipla escolha com 4 alternativas (ids "a","b","c","d") e apenas UMA correta.
- Enunciado contextualizado: situação do cotidiano, definição ou exemplo concreto em 1–2 frases (campo "context") antes da pergunta ("prompt").
- Alternativas incorretas plausíveis e não ambíguas: explorem confusões comuns entre conceitos próximos ou atitudes claramente incoerentes com o conteúdo.
- Avalie compreensão, interpretação e finalidade, não só memorização. Inclua situações práticas de cidadania, convivência e respeito à diversidade quando o conteúdo permitir.
- Afirmativas I, II, III, IV: use o campo "statements" (a numeração romana é automática; NÃO escreva "I." no texto) e alternativas do tipo "Apenas I e II estão corretas".
- Tabelas ou dados: use o campo "table" ({ "headers": [...], "rows": [[...]] }).
- Discursivas ("type": "open"): inclua "expectedAnswer" (modelo de resposta), "keyConcepts", "criteria" (critérios de avaliação; a correção NÃO é por palavra-chave) e "maxPoints" (padrão 3, rubrica de 0 a 3).
- Toda questão objetiva precisa de "explanation" (explicação comentada).

# Fontes
- Preencha "sources.providedMaterial" com o material que eu enviei. Se usou SOMENTE esse material, coloque "onlyProvidedMaterial": true.
- Só liste fontes externas ("external") que você realmente consultou. NUNCA invente referências, páginas ou links.

# Regras do JSON
- "schemaVersion": ${brand.schemaVersion}.
- "id" do simulado: minúsculas, números e hífens (ex.: "historia-5ano-patrimonio-v1"), único e estável.
- Cada questão tem "id" único em todo o arquivo (ex.: "q01", "q02"...).
- "answer" deve ser o id de uma das alternativas.
- JSON válido: aspas duplas, sem vírgula sobrando, sem comentários.

# Esqueleto
${templateJson}

# Conteúdo do simulado
Matéria: [preencher]
Conteúdos/programa: [preencher ou anexar material]
Quantidade desejada de questões: [preencher ou "você decide pela cobertura"]`;
