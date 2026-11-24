# Design system (provisório)

A identidade (nome, logotipo, cores finais) será definida depois. Esta base existe para a troca ser rápida.

## Conceito
Uma **folha de prova sobre uma mesa**. Claro: folha creme sobre mesa areia. Escuro: folha em ardósia suave, texto off-white quente, sem neon. Sem branco nem preto puros.

## Tokens (`src/app/globals.css`)
`desk` (mesa), `paper` (folha), `paper-2` (superfícies internas), `ink`, `muted`, `line`, `line-strong`, `accent` (uma só cor de destaque, para ações e ênfase), `accent-ink`, `accent-soft`, `warm` (correção assistida e pendências), `ok`, `bad` (+ `-soft`/`-line`).
Trocar a identidade = editar estes valores nos dois temas. `src/design/contrast.test.ts` lê os valores reais e exige contraste AA.

## Tipografia
Atkinson Hyperlegible (400 e 700), local. Os outros papéis (título, serifa, mono de números) ficam para a identidade final.

## Padrões que se repetem (classes em `globals.css`)
`.sheet` folha · `.btn` (+ `-primary`, `-danger`, `-sm`, `-icon`) · `.badge` (+ `-warm`, `-ok`, `-bad`, `-muted`) · `.callout` (+ `-warn`, `-bad`) · `.input` · `.card` · `.pick` (botão de escolha: segmentado e rubrica) · `.option` (alternativa) · `.question` · `.part-title`. Layout e espaçamento ficam em utilitários dentro dos componentes.

## Cor nunca é o único sinal
Correto/errado têm texto e ícone. Campo inválido tem borda vermelha **e** mensagem **e** `aria-invalid`. Tipo de correção é um selo com texto.

## Controles
| Intenção | Controle |
|---|---|
| Fazer algo | Botão |
| Ligar/desligar | Interruptor (`role="switch"`), caso do tema |
| Uma entre poucas | Segmentado (rádio nativo; uma parada de Tab, setas dentro) |
| Confirmar ação destrutiva ou com perda | Modal nativo `<dialog>` |
| Resultado de uma ação | Toast (sobrepõe, nunca empurra o layout, some sozinho) |
| Copiar | Botão com ícone que vira "ok" por 2 s |
| Link que sai do app | Ícone de seta, `target="_blank"`, `noopener`, texto "(abre em outra aba)" para leitor de tela |

## Campos
Obrigatório tem `*` e `aria-required`. Erro aparece depois que a pessoa sai do campo, ou em todos ao tentar copiar. Números aceitam só dígitos e uma faixa (`src/core/creator-validation.ts`). Placeholders são exemplos neutros, nunca dados de pessoas.

## Layout e movimento
Funciona a partir de 360 px sem rolagem horizontal. Transições curtas (até ~250 ms) e desligadas com `prefers-reduced-motion`.

## Acessibilidade
Contraste AA testado nos dois temas; foco visível; teclado em tudo; axe automatizado nos testes de navegador; ícones decorativos com `aria-hidden`; botões só com ícone têm rótulo.

## Voz
Neutra, direta, em português. Sem gírias.
