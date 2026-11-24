# Histórico de versões

Também aparece no app, em `/versoes`. A fonte dos dados é `src/changelog/entries.ts`; um teste confere que as duas listas batem.
Versões seguem o padrão X.Y.Z: função nova aumenta o Y, correção aumenta o Z, quebra de compatibilidade aumenta o X.

## 0.2.0 (2026-11-24)

Criar com IA por formulário, tema claro por padrão e nova base visual.

**Novidades**
- Criar com IA: campos para aluno, escola e simulado; o pedido é montado enquanto você digita e fica salvo no navegador.
- Pedido pronto para qualquer IA entender que você só enviará imagens (ou texto) e deve receber um único JSON.
- Validação dos campos com asterisco de obrigatório, destaque em vermelho e mensagem clara.
- Atalhos para Gemini, ChatGPT e Claude no fim da tela de criação.
- Botão para copiar um pedido de correção quando a importação encontra erros.
- Avisos na importação para gabarito concentrado em uma letra e correta sempre a mais longa.
- Confirmações em modal acessível e avisos rápidos (toasts).
- Página de versões e mudanças.

**Mudanças**
- Tema claro (creme) por padrão; a troca é só entre claro e escuro, sem seguir o sistema.
- Interface reescrita com Tailwind CSS, ícones consistentes e layout fluido.
- Fonte Atkinson Hyperlegible carregada junto com o app.
- Cor `warm` do tema claro escurecida para passar no contraste AA (descoberto pelo teste de contraste).

**Por dentro**
- Código reorganizado em `core`, `storage`, `exams`, `features`, `components`, `i18n`, `changelog`.
- Store Zustand por prova; tentativas e histórico lidos do navegador passam por Zod.
- Dicionário tipado, testes ao lado do código, exportação estática ligada.

## 0.1.0 (2026-11-23)

Primeira versão: importar, resolver e corrigir simulados a partir de um JSON.

- Importar e exportar bancos em JSON (formato versão 1) com validação em português.
- Prova com progresso, salvamento automático e retomada.
- Correção automática das objetivas e assistida das discursivas.
- Histórico das últimas 30 tentativas.
- Tema claro e escuro, impressão básica.
- Três bancos de exemplo de História do 5º ano.
