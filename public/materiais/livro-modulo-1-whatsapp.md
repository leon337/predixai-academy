# Integração com WhatsApp Business Platform

## Módulo 1 — Fundamentos e Ecossistema

### Objetivo
Compreender o ecossistema antes da configuração técnica.

## 1. Visão geral do ecossistema
A integração profissional envolve Meta Business, WABA, Cloud API, Graph API, webhook, backend e banco de dados. Cada elemento possui uma responsabilidade específica.

## 2. WhatsApp Business App x Platform
O aplicativo comercial é operado manualmente. A Platform é programável e permite integrações, automações, filas, regras e atendimento em escala.

## 3. Meta Business e WABA
Meta Business organiza ativos, pessoas e permissões. A WABA é a conta oficial do WhatsApp Business dentro dessa estrutura.

## 4. Cloud API e Graph API
A Cloud API permite enviar e receber mensagens usando a infraestrutura hospedada pela Meta. A Graph API é a interface usada para acessar recursos e operações.

## 5. Webhooks e backend
O webhook entrega eventos ao sistema. O backend valida, aplica regras, registra dados, chama serviços e gera respostas.

## 6. Teste, produção e governança
Ambientes de teste reduzem risco. Produção exige monitoramento, credenciais protegidas, revisão de permissões e plano de suporte.

## Fluxo resumido
Cliente → WhatsApp → Cloud API → Webhook → Backend → Banco de dados → Resposta.

## Checklist
- Estrutura Meta revisada;
- credenciais protegidas;
- webhook validado;
- logs e tratamento de erros ativos;
- monitoramento e responsável operacional definidos;
- plano de suporte e rollback documentado.

## Quiz de revisão
1. O que é WABA?
2. Qual é a função do webhook?
3. O que diferencia o App da Platform?
4. Por que separar teste e produção?
