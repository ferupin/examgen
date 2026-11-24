# Desenvolvimento

## Comandos
`npm run dev` · `npm test` · `npm run typecheck` · `npm run build` (gera `out/`) · `npm run test:watch`

Antes de entregar uma fase rode `typecheck`, `test` e `build`.

## Stack
| Área | Escolha |
|---|---|
| Framework | Next.js (App Router), `output: "export"` |
| Linguagem | TypeScript estrito |
| Estilo | Tailwind CSS v4, tokens como variáveis CSS |
| Estado | Zustand (um store por prova) |
| Validação | Zod em tudo que vem de fora |
| Tema | next-themes, claro por padrão, sem modo automático |
| Ícones | lucide-react |
| Fonte | Fontsource (Atkinson Hyperlegible), local |
| Testes | Vitest, ambiente node |

## Pastas
```
src/
  app/          rotas finas, layout, globals.css (tokens)
  core/         TypeScript puro: schema, score, prompt, validação do formulário
  exams/        bancos de exemplo (data/*.json) + registro (index.ts)
  storage/      localStorage com Zod, download de JSON
  i18n/         dicionário pt tipado + t()
  features/     library, runner, importer, creator, changelog
  components/   ui/, theme/, brand/, layout/
  changelog/    entries.ts (versões como dado)
  config.ts     marca, versão, links externos
docs/           este material
```

## Regras de camada
- `core/` não importa React, `features/`, `storage/` nem `i18n/`.
- `components/` nunca importa de `features/`.
- `storage/` pode usar `core/`. `features/` pode usar tudo isso.
- URLs externas só em `config.ts`. Texto visível só em `i18n/pt.ts`.
- Testes ao lado do código (`coisa.ts`, `coisa.test.ts`).
- Cores só por token (`bg-paper`, `text-accent`); nada de hex em componente.
- Uma exceção consciente: o pedido enviado à IA e as mensagens de validação do `core/` estão em português dentro do próprio `core/`. Ver ADR 0005.

## Como adicionar…

**Um banco de exemplo:** salve o JSON em `src/exams/data/`, importe e liste em `src/exams/index.ts`. O teste do formato falha se for inválido.

**Um componente:** decida a pasta (`components/ui`, ou dentro da feature), use só tokens, dê rótulo acessível, ponha o texto no dicionário, teste em 360 px nos dois temas.

**Um token de cor:** defina nos dois temas em `globals.css`, exponha em `@theme inline` e inclua nos pares de `src/design/contrast.test.ts`.

**Um idioma:** crie `src/i18n/<idioma>.ts` satisfazendo `Messages` e ligue no `t()`. Antes, mova para o dicionário o texto do `core/` (ADR 0005).

**Uma versão (release):**
1. Nova entrada no TOPO de `src/changelog/entries.ts`.
2. Seção correspondente em `docs/CHANGELOG.md`.
3. `version` em `package.json` e `package-lock.json`.
4. Marque o item no `docs/ROADMAP.md`.
5. Commit `chore(release): X.Y.Z` e `git tag -a vX.Y.Z`.
O teste `entries.test.ts` confere versão, ordem, datas e o CHANGELOG.
