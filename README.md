# examgen (nome provisório)

Seu banco de questões num arquivo só. Importe um JSON, resolva o simulado, corrija e acompanhe o histórico. **Sem servidor, sem conta, sem banco de dados**: tudo fica no navegador.

Versão atual: **0.3.0** (veja `docs/CHANGELOG.md` ou a página `/versoes` do app).

## Como funciona
1. **Criar:** a tela *Criar com IA* tem campos (aluno, escola, disciplina, assuntos, quantidades, nível). O pedido para a IA é montado enquanto você digita e os campos ficam salvos. O pedido já explica à IA que você só vai enviar imagens (ou texto) e que ela devolve um único `.json`.
2. **Importar:** cole ou envie o arquivo. O app valida e explica os problemas em português. Se houver erro, copie o pedido de correção e cole na mesma conversa da IA.
3. **Resolver:** prova em uma página, com progresso, salvamento automático e retomada. Tema claro (creme, padrão) ou escuro.
4. **Corrigir:** objetivas automáticas; discursivas com correção assistida (rubrica 0 a 3 do projeto, não é escala oficial). Sem nota final enquanto houver discursiva pendente.
5. **Acompanhar:** histórico das últimas 30 tentativas, com exportação em JSON.

## Estado do projeto
- [x] 0.1.0 MVP: importar, resolver, corrigir, histórico
- [x] 0.2.0 Criar com IA por formulário, tema, Tailwind, estrutura em camadas, versões
- [x] 0.3.0 Biblioteca focada nos seus bancos, catálogo do 1º ao 9º ano, formulário refinado
- [x] 0.4.0 Fórmulas (KaTeX), revisão das questões a rever, botão de topo, criador com "Sem material"
- [ ] Impressão revisada · identidade visual · PWA offline · relatório de evolução (`docs/ROADMAP.md`)

Não verificado ainda: impressão em papel, uso offline, nome/marca/domínio livres (INPI, WIPO, domínios, GitHub).

## Rodar
```bash
npm install
npm run dev        # http://localhost:3000
npm test
npm run typecheck
npm run build      # gera o site estático em out/
```

## Publicar
Site 100% estático (`output: "export"`). Na Vercel, o padrão funciona sem configuração. Serve também em Cloudflare Pages, GitHub Pages ou qualquer hospedagem de arquivos.

## Documentação
`docs/development.md` (pastas, regras, como adicionar coisas) · `docs/design-system.md` · `docs/file-format.md` (formato do JSON) · `docs/ROADMAP.md` · `docs/CHANGELOG.md` · `docs/adr/` (decisões)

## Como ajudar sem programar
Teste com um simulado real e relate o que travou, confira gabaritos e respostas-modelo dos bancos de exemplo, ou sugira questões no estilo da sua escola. Veja `CONTRIBUTING.md`.
