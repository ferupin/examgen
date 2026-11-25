# Como contribuir

## Sem escrever código
- Abra uma issue com o que travou, o que confundiu ou uma ideia.
- Revise os bancos de exemplo (`src/exams/catalog`): gabarito, enunciado, respostas-modelo das discursivas.
- Traga questões no estilo da sua escola, em JSON (formato em `docs/file-format.md`).

## Preparar o ambiente
`npm install`, depois `npm run dev`. Antes de enviar mudanças: `npm run typecheck`, `npm test` e `npm run build`.

## Convenções
- Regras de pastas e camadas: `docs/development.md`.
- Texto visível só em `src/i18n/pt.ts`; cor só por token; um componente por arquivo; teste ao lado do código.
- Fase pequena por vez. Não mexa no que já funciona sem necessidade, e diga quando mexer.
- Decisão relevante vira um registro curto em `docs/adr/` antes do código.

## Commits (Conventional Commits, no imperativo)
```
feat(creator): adicionar validação dos campos
fix(runner): manter respostas ao recarregar
docs: registrar ADR 0006
chore(release): 0.3.0
```
Tipos: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`.

## Lançar versão
Veja "Uma versão" em `docs/development.md`.
