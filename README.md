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

## Error Boundaries App (Vite + React)

Projeto complementar que demonstra o uso de **Error Boundaries** em React, reaproveitando os conceitos do e-commerce (catálogo, carrinho, checkout).

### O que são Error Boundaries?

Componentes de classe React que capturam erros JavaScript durante a renderização, em lifecycle methods e em construtores da árvore de componentes filhos. Permitem exibir uma UI de fallback ao invés de quebrar toda a aplicação.

### Arquitetura de Boundaries em 3 níveis

```
[App-Level Boundary]         ← captura qualquer erro global
  └── [Page-Level Boundary]  ← isola cada rota
        ├── /catalogo
        │     └── [Widget-Level Boundary] ← 1 boundary POR card
        ├── /carrinho
        │     └── [Section-Level Boundary] ← isola o resumo
        ├── /checkout           ← page boundary captura erros
        └── /demo               ← laboratório de testes
```

### Cenários de demonstração

| Rota | Ação | Nível |
|------|------|-------|
| `/catalogo` | Clicar em "Detalhes" na **Garrafa Node.js** | Widget — só aquele card mostra fallback |
| `/carrinho` | Total ultrapassar R$ 200 | Section — resumo quebra, lista continua |
| `/checkout` | CEP **00000-000** e confirmar | Page — toda a página exibe fallback |
| `/demo` | Botão "Disparar erro em render" | Page — capturado pelo boundary |
| `/demo` | Botão "Disparar erro em onClick" | Não capturado — usa try/catch |

### Como executar

```bash
cd error-boundaries-app
npm install
npm run dev
```

Acesse http://localhost:5173 no navegador.

## Tecnologias

- React 18
- Webpack 5 Module Federation (projeto MFE)
- Vite 5 (projeto Error Boundaries)
- React Router v6
- npm Workspaces
