# Formato do arquivo de banco de questões

Versão do formato: **1** (`"schemaVersion": 1`). Validado por Zod em `src/core/schema.ts`.

## Promessa

Um arquivo válido na versão 1 continua válido. Mudanças futuras são **aditivas** (campos opcionais novos) ou ganham uma nova versão (`schemaVersion: 2`), com migração das versões antigas. Os bancos de `src/exams/catalog` servem de fixtures: o teste `src/exams/exams.test.ts` e `src/core/schema.test.ts` os carregam a cada execução.

## Estrutura

- `schemaVersion`: 1
- `id`: texto em minúsculas, números e hífens (`[a-z0-9]+(-[a-z0-9]+)*`). Estável: é a chave do histórico.
- `title`, `subject`; opcionais: `grade`, `institution`, `description`
- `sources`: `providedMaterial[]`, `onlyProvidedMaterial?`, `external[]`, `notes?`. Nunca inventar fonte.
- `parts[]`: `id`, `title`, `questions[]`

### Questão `multiple_choice`
`id`, `prompt`, `options[]` (2 a 6, `{id, text}`), `answer` (id de uma opção), `explanation`, `points` (padrão 1). Opcionais: `title`, `context`, `statements[]`, `table`.

### Questão `open`
`id`, `prompt`, `expectedAnswer`, `keyConcepts[]`, `criteria[]`, `maxPoints` (padrão 3). Opcionais: `title`, `context`, `table`.

IDs de questão são únicos no arquivo. O padrão do projeto é 4 alternativas (a a d), uma correta.

## Dados no navegador

Chaves do `localStorage` (prefixo em `src/config.ts`, hoje `examgen.v1`): `.library`, `.attempt.<id>`, `.history.<id>`, `.creator`, `.theme`. Tudo que é lido passa por Zod. Mudar o nome do produto **não** muda o prefixo.
