# Histórico de versões

Também aparece no app, em `/versoes`. A fonte dos dados é `src/changelog/entries.ts`; um teste confere que as duas listas batem.
Versões seguem o padrão X.Y.Z: função nova aumenta o Y, correção aumenta o Z, quebra de compatibilidade aumenta o X.

## 0.4.0 (2026-11-25)

Fórmulas matemáticas e químicas, navegação pelas questões a rever, botão de voltar ao topo e criador com "Sem material".

**Novidades**
- Fórmulas nas questões: `$x^2 + 3x = 10$`, em bloco `$$\frac{a}{b}$$`, química `$\ce{H2O}$`. Fontes e estilos vêm no próprio app, sem internet.
- Depois de corrigir, "Revisar questões" leva às erradas, em branco ou com nota baixa, em ordem, com destaque temporário.
- Botão de voltar ao topo quando o cabeçalho e o menu saem de vista.
- Criar com IA: opção "Sem material" (a IA busca referências no nível da série e dos assuntos); pedido e textos de apoio se adaptam a imagens, texto ou nenhum material.
- Importar: "Colar da área de transferência", "Limpar" e contador de caracteres.
- Ajuda no campo "Número de partes".

**Mudanças**
- Nível: opções não selecionadas ficam apagadas; só a escolhida tem a cor cheia.
- Exemplos sempre fechados na tela inicial.
- Importar com dois passos e divisor "ou".
- "Salvo no navegador" em faixa própria no topo.
- Matemática do catálogo usa fórmulas.

**Correções**
- Barra invertida de fórmula sem dobrar no JSON (`\frac` virava caractere de controle) agora é recusada com explicação.

**Por dentro**
- KaTeX carregado sob demanda; "R$ 5,00" nunca vira fórmula; fórmulas com `aria-label` em português; testes novos.

## 0.3.0 (2026-11-24)

Biblioteca focada nos seus bancos, catálogo de exemplos do 1º ao 9º ano e formulário mais claro.

**Novidades**
- Catálogo de exemplos: 10 questões por matéria (Língua Portuguesa, Matemática, Ciências, História, Geografia, Língua Inglesa, Arte, Educação Física, Ensino Religioso), do 1º ao 9º ano.
- "Assuntos" vira lista de etiquetas removíveis.
- Ícone "?" em Referência curricular.
- Aviso discreto "Salvo no navegador" no topo.

**Mudanças**
- Tela inicial mostra os seus bancos; exemplos ficam num painel sob demanda.
- "Versões" saiu da navegação e foi para o rodapé.
- Avisos no topo, com fade.
- Campos preenchidos se distinguem dos vazios; nível com botões coloridos.
- O simulado de História do protótipo foi substituído pelo catálogo; as revisões da escola ficam em grupo à parte.

**Por dentro**
- Etapa derivada de `grade`; testes do catálogo; componentes HelpTip, TagInput e Segmented com tom.

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
