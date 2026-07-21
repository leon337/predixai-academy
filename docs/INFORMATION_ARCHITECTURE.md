# Arquitetura da Informação — PredixAI Academy

## Versão

0.1 — fundação de navegação e conteúdo

## 1. Objetivo

Definir como a plataforma organiza, apresenta e conecta conteúdos educacionais, permitindo que o aluno encontre rapidamente o que estudar, saiba onde está e entenda o que vem depois.

## 2. Hierarquia principal

```text
PredixAI Academy
└── Trilha
    └── Curso
        └── Módulo
            └── Aula
                └── Unidade de aprendizagem
```

## 3. Conceitos

### Trilha

Agrupa cursos relacionados a uma competência ampla.

Exemplo:

- Comunicação e Automação Empresarial.

### Curso

Forma uma jornada completa com objetivo, resultado final e projeto aplicado.

Exemplo:

- Integração com WhatsApp Business Platform.

### Módulo

Representa uma etapa de progressão do curso e pode gerar um volume editorial próprio.

Exemplo:

- Módulo 1 — Fundamentos e Ecossistema.

### Aula

Trabalha um objetivo específico dentro do módulo.

### Unidade de aprendizagem

É a menor parte pedagógica consumível, como conceito, diagrama, prática, exemplo, pergunta ou reflexão.

## 4. Mapa da plataforma pública

```text
/
├── Início
├── Explorar
│   ├── Trilhas
│   ├── Cursos
│   ├── Temas
│   └── Níveis
├── Minha aprendizagem
│   ├── Continuar estudando
│   ├── Cursos em andamento
│   ├── Concluídos
│   ├── Favoritos
│   └── Certificados
├── Biblioteca
│   ├── Livros e PDFs
│   ├── Glossários
│   ├── Diagramas
│   ├── Apresentações
│   └── Materiais complementares
├── Comunidade
├── Sobre
└── Conta
```

## 5. Mapa do curso

```text
Curso
├── Visão geral
├── Resultado esperado
├── Pré-requisitos
├── Projeto aplicado
├── Estrutura do curso
│   ├── Módulo 1
│   ├── Módulo 2
│   └── ...
├── Instrutor ou autoria
├── Recursos
├── Avaliações
└── Certificação
```

## 6. Mapa do módulo

```text
Módulo
├── Capa e identidade
├── Objetivos
├── Competências
├── Pré-requisitos
├── Índice
├── Aulas
├── Caso da empresa fictícia
├── Glossário
├── Perguntas frequentes
├── Erros comuns
├── Quiz
├── Checklist
├── Projeto ou desafio
├── Resumo visual
└── Downloads
```

## 7. Mapa da aula

```text
Aula
├── Título
├── Objetivo
├── Contexto
├── Problema
├── Conceito
├── Analogia
├── Representação visual
├── Exemplo
├── Aplicação na empresa fictícia
├── Verificação rápida
├── Exercício
├── Resumo
└── Próxima aula
```

## 8. Navegação global

A navegação principal deve ser curta e previsível.

Itens recomendados para o MVP:

- Início;
- Cursos;
- Trilhas;
- Biblioteca;
- Minha aprendizagem;
- Pesquisa;
- Perfil.

## 9. Navegação contextual

Durante a aula, o aluno deve visualizar:

- trilha atual;
- curso atual;
- módulo atual;
- aula atual;
- progresso;
- botão anterior;
- botão próximo;
- índice lateral ou recolhível;
- acesso ao glossário;
- marcação de conclusão.

## 10. Página inicial

A página inicial deve responder em poucos segundos:

1. O que é a PredixAI Academy?
2. O que o aluno pode aprender?
3. Qual curso pode começar agora?
4. Qual benefício concreto receberá?
5. Como continuar de onde parou?

### Blocos recomendados

- destaque principal;
- continuar estudando;
- curso em evidência;
- trilhas;
- cursos recentes;
- recursos gratuitos;
- metodologia;
- resultados de aprendizagem;
- chamada para cadastro.

## 11. Catálogo de cursos

O catálogo deverá permitir filtrar por:

- tema;
- nível;
- formato;
- duração;
- status;
- gratuito ou premium;
- trilha;
- competência.

Cada card deve exibir:

- capa;
- nome;
- resumo;
- nível;
- duração aproximada;
- quantidade de módulos;
- progresso, quando aplicável;
- status de publicação.

## 12. Página do curso de WhatsApp

Estrutura inicial:

```text
Integração com WhatsApp Business Platform
├── Apresentação
├── Para quem é
├── O que será construído
├── Empresa fictícia
├── Módulos
│   ├── 01 Fundamentos e Ecossistema
│   ├── 02 WhatsApp Business App
│   ├── 03 Meta Business e WABA
│   ├── 04 Cloud API
│   ├── 05 Webhooks
│   ├── 06 Mensagens e Templates
│   ├── 07 Backend e Banco de Dados
│   ├── 08 Agentes de IA
│   ├── 09 Atendimento Humano e CRM
│   └── 10 Projeto Final
├── Materiais
├── Avaliações
└── Certificação futura
```

## 13. Biblioteca

A biblioteca não deve duplicar o curso. Ela deve permitir acesso transversal a recursos reutilizáveis.

Tipos de conteúdo:

- livros;
- PDFs;
- glossários;
- diagramas;
- mapas mentais;
- checklists;
- apresentações;
- roteiros;
- podcasts;
- materiais de apoio.

## 14. Pesquisa

A pesquisa futura deve encontrar:

- cursos;
- módulos;
- aulas;
- termos do glossário;
- perguntas frequentes;
- diagramas;
- materiais.

Resultados devem indicar o contexto completo:

```text
Curso > Módulo > Aula > Unidade
```

## 15. Estados de conteúdo

Todo conteúdo deverá possuir estado editorial:

- rascunho;
- em revisão;
- aprovado;
- publicado;
- desatualizado;
- arquivado.

## 16. Estados de aprendizagem

Cada item pode possuir:

- não iniciado;
- em andamento;
- concluído;
- precisa revisar;
- bloqueado por pré-requisito.

## 17. Progresso

O progresso deve ser exibido em três níveis:

- aula;
- módulo;
- curso.

No MVP, a conclusão poderá depender de:

- leitura ou consumo mínimo;
- marcação manual;
- verificação rápida;
- quiz final do módulo;
- entrega do desafio, quando aplicável.

## 18. Responsividade

A arquitetura deve funcionar prioritariamente em celular, considerando:

- navegação recolhível;
- leitura confortável;
- índice acessível;
- botões grandes;
- diagramas adaptáveis;
- retomada rápida;
- baixo consumo de dados.

## 19. Acessibilidade

Requisitos básicos:

- estrutura semântica;
- navegação por teclado;
- contraste adequado;
- foco visível;
- texto alternativo;
- transcrições;
- não depender exclusivamente de cor;
- controle de animações;
- tamanhos de fonte ajustáveis.

## 20. Administração futura

```text
Admin
├── Cursos
├── Trilhas
├── Módulos
├── Aulas
├── Recursos
├── Quizzes
├── Usuários
├── Progresso
├── Publicação
└── Relatórios
```

O MVP não precisa começar com um CMS completo. Conteúdo em MDX ou formato estruturado pode ser suficiente na primeira versão.

## 21. Rotas sugeridas

```text
/
/cursos
/cursos/[curso]
/cursos/[curso]/modulos/[modulo]
/cursos/[curso]/modulos/[modulo]/aulas/[aula]
/trilhas
/trilhas/[trilha]
/biblioteca
/glossario
/minha-aprendizagem
/perfil
```

## 22. Critérios de aprovação

A arquitetura da informação será aprovada quando:

- o aluno souber sempre onde está;
- a hierarquia não gerar confusão entre formação, trilha, curso, módulo e aula;
- o curso de WhatsApp se encaixar sem exceções;
- novos cursos puderem reutilizar a mesma estrutura;
- a navegação funcionar em celular e desktop;
- os recursos editoriais estiverem conectados ao conteúdo principal;
- o MVP puder ser implementado sem exigir CMS completo.

## 23. Próxima etapa

Após aprovação:

1. definir requisitos funcionais e não funcionais do MVP;
2. criar fluxos principais do usuário;
3. projetar wireframes;
4. definir Design System;
5. decidir arquitetura técnica final.
