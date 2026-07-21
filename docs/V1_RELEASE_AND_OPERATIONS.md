# PredixAI Academy v1.0 — Release, Qualidade e Operação

## Escopo entregue

- Portal público e catálogo;
- autenticação, confirmação e recuperação de senha;
- leitor de aulas, quizzes e progresso persistente;
- painel do aluno e biblioteca;
- pacote editorial do curso-piloto;
- CMS administrativo com cursos, módulos, aulas, quizzes e assets;
- papéis administrativos, RLS e histórico de alterações;
- canal de suporte e feedback do piloto;
- health check, smoke test e workflow de qualidade.

## Critérios técnicos

- TypeScript sem erros;
- build Next.js concluído;
- rotas críticas respondendo com status 2xx/3xx;
- RLS habilitada nas tabelas públicas sensíveis;
- escrita editorial restrita a perfis `admin`;
- alterações editoriais registradas em `content_audit_logs`;
- feedback autenticado registrado em `pilot_feedback`;
- foco visível, alvos móveis e suporte a `prefers-reduced-motion`.

## Rotas críticas

- `/`
- `/cursos`
- `/cursos/whatsapp-business-platform`
- `/login`
- `/recuperar-senha`
- `/perfil`
- `/biblioteca`
- `/admin`
- `/suporte`
- `/api/health`

## Operação

### Publicação

1. Executar `npm test`.
2. Publicar na branch `main`.
3. Aguardar deployment Vercel em estado `READY`.
4. Executar `npm run smoke` contra produção.
5. Verificar `/api/health`.
6. Registrar commit e deployment no Linear.

### Suporte

- Canal oficial do piloto: `/suporte`.
- Feedback fica em `pilot_feedback`.
- Classificação: `new`, `reviewed`, `resolved` ou `archived`.
- Nunca solicitar senhas, tokens ou segredos.

### Incidente

1. Confirmar impacto e rota afetada.
2. Consultar logs da Vercel e do Supabase.
3. Reproduzir em ambiente controlado.
4. Corrigir na menor alteração possível.
5. Validar build e smoke test.
6. Fazer novo deployment.
7. Documentar causa, correção e risco residual.

### Rollback

- Identificar o último deployment `READY` estável na Vercel.
- Promovê-lo novamente para produção ou reverter o commit na `main`.
- Confirmar `/api/health` e rotas críticas.
- Preservar migrations de banco; migrations destrutivas exigem plano específico.

## Piloto controlado

- Público inicial: proprietário e convidados autorizados.
- Entrada pela URL oficial da Academy.
- Feedback pelo formulário autenticado em `/suporte`.
- Bloqueadores: falha de login, perda de progresso, conteúdo inacessível, erro de quiz, acesso administrativo indevido ou rota crítica indisponível.

## Riscos residuais

- A validação visual completa em múltiplos navegadores depende de testes humanos adicionais.
- O envio de e-mails depende da configuração e limites do provedor Supabase Auth.
- O CMS usa operações diretas do cliente protegidas por RLS; futuras versões podem migrar mutações para rotas de servidor.
- Arquivos binários podem ser migrados para Supabase Storage quando o volume aumentar.
