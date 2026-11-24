# examgen

> Nome **provisório**. A identidade (nome, logo, cores) será definida depois; veja [Trocar o nome](#trocar-o-nome-e-a-identidade).

Plataforma de simulados escolares a partir de **bancos de questões em JSON**.
Sem backend e sem banco de dados: o banco é um arquivo que você guarda no drive, no pendrive ou no celular. As respostas e o histórico ficam só no navegador de quem usa.

## Como funciona

1. **Criar:** a tela *Criar com IA* entrega um pedido pronto para colar em uma IA (ChatGPT, Claude, Gemini…). Você informa o conteúdo e a IA devolve um `.json` no formato do app.
2. **Importar:** a tela *Importar* valida o arquivo (com mensagens de erro em português) e guarda na biblioteca do navegador. Aceita arquivo, arrastar e soltar, ou texto colado (inclusive com cerca ```` ```json ````).
3. **Resolver:** prova em uma página só, com progresso, salvamento automático, retomada ao reabrir e tema claro (creme) ou escuro (ardósia suave).
4. **Corrigir:** objetivas são corrigidas automaticamente, com explicação comentada. Discursivas têm **correção assistida**: modelo de resposta, critérios, rubrica 0–3 e comentário. A **nota final só aparece quando não há discursivas pendentes**.
5. **Guardar:** cada banco pode ser baixado de volta como JSON. O histórico das últimas 30 tentativas pode ser exportado.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # testes do núcleo (schema e pontuação)
npm run build      # build de produção
```

Requer Node 20+.

## Publicar na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, escolha o repositório e clique em **Deploy**. Não precisa de nenhuma variável de ambiente.

O app é 100% estático/client-side, então também roda em Cloudflare Pages, Netlify ou qualquer hospedagem de arquivos. Para exportar como site estático, descomente `output: "export"` em `next.config.mjs`.

## Formato do JSON (v1)

O contrato completo está em [`src/lib/schema.ts`](src/lib/schema.ts) e um exemplo válido em [`src/lib/template.ts`](src/lib/template.ts). Resumo:

```jsonc
{
  "schemaVersion": 1,
  "id": "historia-5ano-v1",            // único e estável (minúsculas, números, hífens)
  "title": "…", "subject": "História", "grade": "5º Ano", "institution": "…",
  "sources": { "providedMaterial": ["…"], "onlyProvidedMaterial": true, "external": [] },
  "parts": [{
    "id": "parte-1", "title": "…",
    "questions": [
      { "type": "multiple_choice", "id": "q01", "context": "…", "prompt": "…",
        "statements": ["…"],            // opcional: afirmativas I, II, III, IV
        "table": { "headers": ["…"], "rows": [["…"]] },   // opcional
        "options": [{ "id": "a", "text": "…" } /* … */],
        "answer": "b", "explanation": "…", "points": 1 },
      { "type": "open", "id": "q02", "prompt": "…",
        "expectedAnswer": "…", "keyConcepts": ["…"], "criteria": ["…"], "maxPoints": 3 }
    ]
  }]
}
```

## Dados e privacidade

Tudo é gravado no `localStorage` do navegador (chaves `examgen.v1.*`). Nada é enviado para a internet. Limpar os dados do navegador apaga biblioteca e histórico, então **baixe o JSON dos bancos** e **exporte o histórico** para guardar.

## Trocar o nome e a identidade

Tudo que define a marca está concentrado em poucos lugares:

| O que | Onde |
|---|---|
| Nome e frase de apresentação | `src/lib/brand.ts` |
| Cores (claro e escuro) | variáveis no topo de `src/app/globals.css` |
| Logo no cabeçalho | componente `Logo` em `src/components/Header.tsx` |
| Ícone da aba | `src/app/icon.svg` |
| Nome do pacote | `package.json` |

`brand.storagePrefix` **não** precisa mudar junto com o nome (mudar apaga o acesso aos dados já salvos nos navegadores).

**Renomear o repositório:** no GitHub, *Settings → Repository name*. O endereço antigo passa a redirecionar para o novo. Na Vercel, o nome do projeto e o domínio padrão são alterados separadamente em *Settings*; domínio próprio não é afetado.

## Bancos de exemplo

- `historia-patrimonio-brasil-5ano.json`: 35 questões (30 objetivas + 5 discursivas), convertidas do protótipo HTML. Os modelos de resposta das discursivas foram **redigidos na conversão** e precisam de revisão do responsável.
- `revisao-historia-iii-trimestre-5ano.json`: 9 questões transcritas da revisão oficial da escola (fotografia). **Confira o texto das questões 6 e 9 e o gabarito com a escola**: o gabarito foi deduzido pelo conteúdo, não copiado de um gabarito oficial.

## Roadmap

**MVP (esta versão):** importar/exportar JSON, validação, prova com autosave e retomada, correção automática e assistida, histórico, temas, impressão básica, template para IA.

**Fase 2:** impressão/PDF da prova em papel (com e sem gabarito); "refazer só os erros"; filtro por parte; embaralhar questões e alternativas; importar vários bancos de uma vez; modo "uma questão por vez".

**Fase 3:** PWA instalável com uso 100% offline; relatório de evolução (gráficos por parte/tema); registro de fontes visível na prova; ilustrações SVG locais nas questões.

**Fase 4:** identidade visual completa (nome, logo, mascote); novas matérias; sincronização opcional entre aparelhos (sem servidor próprio, por exemplo via arquivo no drive).
