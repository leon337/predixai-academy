# Mapa do ecossistema WhatsApp Business Platform

## Componentes principais

1. **WhatsApp Business App** — aplicativo comercial operado manualmente no celular.
2. **Meta Business** — estrutura administrativa da empresa na Meta.
3. **WABA** — conta oficial do WhatsApp Business dentro da estrutura Meta.
4. **Cloud API** — API hospedada pela Meta para envio e recebimento de mensagens.
5. **Graph API** — interface usada para acessar recursos da plataforma Meta.
6. **Webhook** — canal pelo qual eventos e mensagens chegam ao sistema.
7. **Backend** — aplica regras, processa eventos e integra dados.
8. **Banco de dados** — registra clientes, conversas, estados e histórico operacional.

## Fluxo resumido

Cliente → WhatsApp → Cloud API → Webhook → Backend → Banco de dados

## Regra de estudo

Antes de implementar, identifique claramente qual componente recebe, transporta, processa e registra cada informação.
