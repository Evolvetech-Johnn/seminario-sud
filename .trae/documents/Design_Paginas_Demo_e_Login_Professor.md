# Especificação de Design — Página Demo + Login do Professor (desktop-first)

## Tokens e estilos globais (aplicáveis às duas páginas)
- **Layout base**: container central `max-w-6xl`, padding lateral 16–24px, espaçamentos em múltiplos de 4.
- **Tipografia**:
  - Título página: 28–32px, bold.
  - Subtítulo/descrição: 14–16px, cor slate-600.
  - Texto base: 14–16px.
- **Cores**:
  - Fundo: branco.
  - Superfícies: branco com borda slate-200.
  - Primária (ações): `sud-navy` (botões principais).
  - Neutras: `sud-gray` para cabeçalhos de tabela / áreas de destaque.
  - Estados: erro rose-50/rose-200, sucesso emerald-50/emerald-200.
- **Componentização**: cards arredondados (raio 24–32), sombras leves; botões com hover (reduzir opacidade em 10%).
- **Responsivo**:
  - Desktop (>=1024): 3 colunas em métricas + grids.
  - Tablet (>=640): 2 colunas.
  - Mobile: 1 coluna, tabelas viram cards (stack) quando necessário.

---

## Página: Login do professor
### Layout
- Coluna única centralizada, usando Flexbox (alinhamento vertical com `min-h-dvh`).

### Meta Information
- Title: "Login do professor — Seminário"
- Description: "Acesse o painel do professor para acompanhar alunos, respostas e chamada."
- Open Graph: título e descrição iguais; `og:type=website`.

### Estrutura da página
1. **Topo (branding simples)**
   - Logo/nome do projeto.
   - Texto curto: “Acesso restrito ao professor”.
2. **Card do formulário**
   - Campos: e-mail, senha.
   - CTA primário: “Entrar”.
   - Link secundário (se aplicável): “Voltar para página inicial”.
3. **Estados**
   - Loading no botão.
   - Erro (credenciais inválidas): banner dentro do card.

### Interações
- Enter envia o formulário.
- Em sucesso: redirecionar para `next` ou para `/admin/demo`.

---

## Página: Página Demo do sistema (Professor)
### Layout
- Estrutura em seções empilhadas (CSS Grid + Flexbox):
  - Seção 1: cabeçalho (título + contexto).
  - Seção 2: atalhos (grid de botões/links).
  - Seção 3: métricas (grid 3 colunas).
  - Seção 4: painéis (tabelas compactas lado a lado no desktop).
  - Seção 5: ações guiadas + validação do seed.

### Meta Information
- Title: "Demo do sistema — Painel do professor"
- Description: "Página de demonstração que centraliza links, métricas e ações do sistema."
- Open Graph: título e descrição iguais; `og:type=website`.

### Estrutura e componentes
1. **Cabeçalho da página**
   - H1: “Demo do sistema”.
   - Subtexto: objetivo da demo.
   - Chip(s) de status:
     - Storage: “mongo”/“local”.
     - Alerta: “MongoDB não configurado” (se aplicável).

2. **Atalhos (links em cards)**
   - Cards/Buttons para: Dashboard, Respostas, Chamada, Alunos, Aulas, Login do aluno, Confirmação de presença.
   - Cada item com:
     - Ícone + título.
     - Descrição de 1 linha (“Ver respostas recentes”, “Criar chamada”, etc.).

3. **Métricas (espelho do Dashboard)**
   - 3 cards: Total de aulas, Total de alunos, Progresso médio.
   - Ação: botão “Recarregar” (ícone de refresh) no canto da seção.

4. **Painéis de dados (visão rápida)**
   - **Respostas recentes** (tabela compacta): aluno, lição, atualizado em; link “ver tudo”.
   - **Chamada (últimas sessões)**: data, lição, presentes/ausentes; link “abrir chamada”.
   - **Alunos (amostra)**: lista 5–10 itens; badge “alto/baixo engajamento”.

5. **Ações guiadas de demo (wizard leve, sem sair da página)**
   - Passo 1: “Criar sessão de chamada de hoje” (POST).
   - Passo 2: “Ver/filtrar códigos gerados” (mostrar tabela de códigos por aluno).
   - Passo 3: “Simular confirmação” (campo para colar um código + POST; exibir retorno: aluno + já confirmado?).
   - Passo 4: “Abrir uma lição para resposta” (link direto para uma `aulas/[slug]`).

6. **Validação do seed (checklist)**
   - Checklist em card (linhas com status):
     - “5 alunos cadastrados”
     - “>= 6 sessões de chamada”
     - “>= 40 respostas completas (completed=true)”
     - “Progresso médio > 0%”
   - Se falhar: exibir instrução curta de como seedar.

### Estados e acessibilidade
- Placeholders com “...” durante carregamento.
- Erros em banner no topo da seção correspondente.
- Tabelas com cabeçalho fixo no desktop; no mobile, itens viram cards (linha por item).
- Foco visível em botões e inputs (outline).
