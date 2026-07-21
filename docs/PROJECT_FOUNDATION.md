# Fundação do Projeto — PredixAI Academy

## 1. Propósito

Criar uma plataforma educacional de alto nível para cursos técnicos e aplicados da PredixAI BR, combinando conteúdo claro, experiência visual, prática guiada e acompanhamento de aprendizagem.

## 2. Problema

A estrutura atual do `predixai-knowledge` cumpre o papel de biblioteca pública e memória institucional, mas não oferece a experiência necessária para uma plataforma educacional completa com catálogo, trilhas, módulos, progresso, quizzes, perfis e conteúdo interativo.

## 3. Público inicial

- estudantes de programação;
- profissionais iniciantes em IA e automação;
- empreendedores interessados em integração de sistemas;
- pessoas que desejam aplicar tecnologias em empresas reais;
- alunos que precisam de explicações visuais e progressivas.

## 4. Resultado esperado

O aluno deve sair de cada curso com:

- compreensão conceitual;
- capacidade de explicar a arquitetura;
- experiência prática;
- projeto progressivo;
- material de consulta;
- evidência clara das competências adquiridas.

## 5. Curso-piloto

### Integração com WhatsApp Business Platform

Primeiro conteúdo validado:

- Módulo 1 — Fundamentos e Ecossistema.

Artefatos previstos:

- curso web;
- livro PDF ilustrado;
- glossário;
- mapa mental;
- quiz;
- checklist;
- apresentação;
- material para vídeo, podcast e redes sociais.

## 6. Metodologia provisória

Fluxo de aprendizagem:

```text
Contexto
→ Problema
→ Conceito
→ Analogia
→ Diagrama
→ Exemplo
→ Aplicação
→ Recuperação ativa
→ Feedback
→ Projeto progressivo
→ Revisão
```

Princípios:

1. clareza antes de complexidade;
2. relação entre componentes antes de memorização;
3. visualização com função pedagógica;
4. teoria ligada a uma empresa fictícia progressiva;
5. microavaliações ao longo do conteúdo;
6. acessibilidade e leitura móvel;
7. conteúdo reutilizável em vários formatos;
8. separação entre conhecimento, produto e operação.

## 7. Arquitetura institucional

```text
predixai-knowledge
Biblioteca e memória institucional
        ↓ fontes validadas
predixai-academy
Aplicação educacional
        ↓
Vercel + Supabase
```

Responsabilidades:

- GitHub: código, documentação técnica e histórico.
- Linear: planejamento, backlog, dependências e decisões operacionais.
- Vercel: preview, homologação e produção.
- Supabase: autenticação, banco, progresso e armazenamento, após aprovação.
- Google Drive: documentos editoriais, apresentações e arquivos de produção.

## 8. MVP provisório

Incluído:

- home pública;
- catálogo de cursos;
- página de curso;
- página de módulo;
- leitor de conteúdo;
- progresso;
- quiz;
- glossário;
- download de PDF;
- experiência responsiva;
- curso de WhatsApp como piloto.

Fora do MVP:

- marketplace;
- pagamentos;
- comunidade;
- aplicativo móvel nativo;
- múltiplos instrutores;
- gamificação avançada;
- certificados verificáveis;
- assistente de IA personalizado.

## 9. Fases

### Fase 0 — Fundação

- metodologia;
- empresa fictícia;
- arquitetura da informação;
- requisitos;
- MVP;
- riscos;
- critérios de aceitação.

### Fase 1 — Experiência

- Design System;
- wireframes;
- fluxos UX e LX;
- protótipo navegável.

### Fase 2 — Fundação técnica

- Next.js e TypeScript;
- estrutura do repositório;
- qualidade, testes e CI;
- integração com Vercel.

### Fase 3 — Curso-piloto

- conteúdo do Módulo 1;
- PDF;
- quiz;
- glossário;
- progresso.

### Fase 4 — Dados e contas

- autenticação;
- perfis;
- progresso persistente;
- políticas de acesso;
- painel mínimo.

### Fase 5 — Validação e lançamento

- testes de usabilidade;
- acessibilidade;
- desempenho;
- segurança;
- publicação controlada.

## 10. Bloqueios de implementação

Não iniciar código de interface final antes de aprovar:

- nome e escopo oficial do produto;
- metodologia;
- empresa fictícia;
- arquitetura da informação;
- Design System;
- wireframes;
- modelo de conteúdo;
- arquitetura técnica;
- backlog e critérios de aceitação.

## 11. Estado dos serviços em 21 de julho de 2026

- GitHub: repositório `predixai-academy` disponível e iniciado documentalmente.
- Linear: workspace e equipe identificados; criação automática apresentou erro no conector e deverá ser retomada.
- Vercel: equipe `PREDIX AI BR` identificada, sem projetos cadastrados.
- Supabase: organização identificada; nenhum projeto dedicado à Academy criado.
- GitHub Pages: `predixai-knowledge` continua como Knowledge Hub público.

## 12. Próxima decisão

Definir formalmente a Metodologia PredixAI de Aprendizagem Aplicada e a arquitetura de informação da plataforma antes da implementação.
