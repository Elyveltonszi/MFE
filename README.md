# MFE E-Commerce Portal

Portal de e-commerce interno construido com arquitetura de microfrontends usando Webpack 5 Module Federation e React 18.

## Arquitetura

O projeto segue os tres pilares de microfrontends:

**Componentizacao** — Biblioteca compartilhada (`shared/`) com componentes base (Button, Card, Input) exposta via Module Federation. Todos os MFEs consomem os mesmos componentes, garantindo consistencia visual.

**Comunicacao** — Event Bus (pub/sub) usando Custom Events do browser. Os MFEs se comunicam sem dependencia direta entre si. Um CartStore global persiste o estado do carrinho independente da rota ativa.

**Roteamento** — O shell (host) usa React Router com lazy loading para carregar cada MFE sob demanda. Cada squad pode desenvolver e deployar seu MFE de forma independente.

## Estrutura

| Modulo | Porta | Responsabilidade |
|--------|-------|-----------------|
| shared | 3000 | Componentes base, EventBus, CartStore |
| shell | 3001 | Layout global, roteamento, carregamento dos MFEs |
| mfe-catalogo | 3002 | Grid de produtos com botao "Adicionar ao carrinho" |
| mfe-carrinho | 3003 | Listagem de itens, quantidades, total e finalizacao |
| mfe-checkout | 3004 | Formulario de endereco e tela de confirmacao |

## Como executar

```bash
npm install
npm start
```

Acesse http://localhost:3001 no navegador.

## Tecnologias

- React 18
- Webpack 5 Module Federation
- React Router v6
- npm Workspaces
