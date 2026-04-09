import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import CartStore from "./store/cartStore";
import "./App.css";

// Páginas importadas diretamente (sem lazy para simplificar —
// em produção, usar lazy + Suspense é recomendado)
import CatalogoPage, { ProductCard } from "./pages/Catalogo";
import CarrinhoPage, { CartSummary } from "./pages/Carrinho";
import CheckoutPage from "./pages/Checkout";
import DemoPage from "./pages/Demo";

import products from "./data/products";
import EventBus from "./store/eventBus";
import Button from "./components/Button";
import Card from "./components/Card";

/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║              ARQUITETURA DE ERROR BOUNDARIES              ║
 * ╠═══════════════════════════════════════════════════════════╣
 * ║                                                           ║
 * ║  [App-Level Boundary]  ← captura erros globais            ║
 * ║    │                                                       ║
 * ║    ├── Header (sem boundary — deve sempre funcionar)       ║
 * ║    │                                                       ║
 * ║    └── [Page-Level Boundary]  ← isola cada rota            ║
 * ║          │                                                  ║
 * ║          ├── /catalogo                                      ║
 * ║          │     └── [Widget-Level Boundary]  ← por card      ║
 * ║          │           └── ProductCard                        ║
 * ║          │                                                  ║
 * ║          ├── /carrinho                                      ║
 * ║          │     ├── Lista de itens (sem boundary)            ║
 * ║          │     └── [Section-Level Boundary]                 ║
 * ║          │           └── CartSummary                        ║
 * ║          │                                                  ║
 * ║          ├── /checkout                                      ║
 * ║          │     └── Formulário (page boundary captura)       ║
 * ║          │                                                  ║
 * ║          └── /demo                                          ║
 * ║                └── Laboratório de testes                    ║
 * ╚═══════════════════════════════════════════════════════════╝
 */

// ── Versão do Catálogo COM Error Boundary POR CARD ──
const CatalogoWithBoundaries = () => (
  <div className="catalogo">
    <h2 className="catalogo-title">📦 Catálogo de Produtos</h2>
    <p className="catalogo-subtitle">
      Clique em "Detalhes" no produto <strong>Garrafa Node.js</strong> para
      simular um erro isolado por Error Boundary no nível do card (widget).
    </p>
    <div className="catalogo-grid">
      {products.map((product) => (
        <ErrorBoundary
          key={product.id}
          level="widget"
          fallback={({ error, resetError }) => (
            <Card className="catalogo-card">
              <div style={{ textAlign: "center", padding: 24 }}>
                <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>🚫</span>
                <h3 style={{ color: "#1f2937", fontSize: 16, marginBottom: 6, fontWeight: 600 }}>
                  Produto indisponível
                </h3>
                <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
                  Este produto não está disponível no momento.
                </p>
                <Button variant="secondary" onClick={resetError}>
                  Verificar disponibilidade
                </Button>
              </div>
            </Card>
          )}
        >
          <ProductCard product={product} />
        </ErrorBoundary>
      ))}
    </div>
  </div>
);

// ── Versão do Carrinho COM Error Boundary no RESUMO ──
const CarrinhoWithBoundaries = () => {
  const [items, setItems] = useState(() => CartStore.getItems());

  useEffect(() => {
    return CartStore.subscribe(({ items: updated }) => setItems(updated));
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const navigate = (path) => {
    window.location.hash = path;
  };

  if (items.length === 0) {
    return (
      <div className="carrinho">
        <h2 className="carrinho-title">🛒 Seu Carrinho</h2>
        <Card className="carrinho-empty">
          <p>Seu carrinho está vazio.</p>
          <p>Vá ao catálogo e adicione produtos!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="carrinho">
      <h2 className="carrinho-title">🛒 Seu Carrinho</h2>
      <p className="carrinho-hint">
        Adicione itens até ultrapassar R$ 200 para simular erro no resumo do pedido.
      </p>

      <div className="carrinho-layout">
        <div className="carrinho-items">
          {items.map((item) => (
            <Card key={item.id} className="carrinho-item">
              <img src={item.image} alt={item.name} className="carrinho-img" />
              <div className="carrinho-item-info">
                <h3>{item.name}</h3>
                <p className="carrinho-item-price">
                  R$ {item.price.toFixed(2)} cada
                </p>
              </div>
              <div className="carrinho-item-qty">
                <Button
                  variant="secondary"
                  onClick={() => CartStore.updateQuantity(item.id, -1)}
                >
                  −
                </Button>
                <span className="carrinho-qty-value">{item.quantity}</span>
                <Button
                  variant="secondary"
                  onClick={() => CartStore.updateQuantity(item.id, 1)}
                >
                  +
                </Button>
              </div>
              <span className="carrinho-item-subtotal">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
              <Button
                variant="danger"
                onClick={() => CartStore.removeItem(item.id)}
              >
                ✕
              </Button>
            </Card>
          ))}
        </div>

        {/* Error Boundary isola o resumo — a lista acima continua funcionando */}
        <ErrorBoundary
          level="section"
          fallback={({ error, resetError }) => (
            <Card style={{ padding: 24, textAlign: "center" }}>
              <span style={{ fontSize: 36, display: "block", marginBottom: 8 }}>⚠️</span>
              <h3 style={{ color: "#991b1b", fontSize: 16, marginBottom: 8 }}>
                Erro no resumo
              </h3>
              <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
                {error.message}
              </p>
              <p style={{ color: "#6b7280", fontSize: 12, marginBottom: 12 }}>
                Remova itens para reduzir o total abaixo de R$ 200.
              </p>
              <Button variant="secondary" onClick={resetError}>
                Recalcular
              </Button>
            </Card>
          )}
        >
          <CartSummary total={total} itemCount={itemCount} />
        </ErrorBoundary>
      </div>

      <div className="carrinho-actions">
        <NavLink to="/checkout">
          <Button disabled={items.length === 0}>Ir para Checkout</Button>
        </NavLink>
      </div>
    </div>
  );
};

// ── Loading fallback ──
const Loading = () => (
  <div className="shell-loading">
    <div className="shell-spinner" />
    <p>Carregando...</p>
  </div>
);

// ── APP PRINCIPAL ──
const App = () => {
  const [cartCount, setCartCount] = useState(0);
  const [errorLog, setErrorLog] = useState([]);

  useEffect(() => {
    return CartStore.subscribe(({ items }) => {
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    });
  }, []);

  /** Callback global para logging de erros — passado aos ErrorBoundaries */
  const handleBoundaryError = (error, errorInfo) => {
    setErrorLog((prev) => [
      ...prev.slice(-4), // mantém últimos 5
      {
        time: new Date().toLocaleTimeString("pt-BR"),
        message: error.message,
        component: errorInfo.componentStack?.split("\n")[1]?.trim() || "desconhecido",
      },
    ]);
  };

  return (
    /* ── NÍVEL 1: Error Boundary GLOBAL (app) ── */
    <ErrorBoundary
      level="page"
      onError={handleBoundaryError}
      fallback={({ error, resetError }) => (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: 40 }}>
          <span style={{ fontSize: 64, marginBottom: 16 }}>💥</span>
          <h1 style={{ color: "#991b1b", marginBottom: 8 }}>Erro Crítico na Aplicação</h1>
          <p style={{ color: "#6b7280", marginBottom: 24, maxWidth: 480, textAlign: "center" }}>
            {error.message}
          </p>
          <button
            onClick={() => { resetError(); window.location.href = "/"; }}
            style={{ padding: "12px 32px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 16 }}
          >
            Reiniciar Aplicação
          </button>
        </div>
      )}
    >
      <div className="shell-layout">
        <header className="shell-header">
          <div className="shell-logo">🛒 MFE Commerce — Error Boundaries</div>
          <nav className="shell-nav">
            <NavLink to="/catalogo" className="shell-nav-link">
              Catálogo
            </NavLink>
            <NavLink to="/carrinho" className="shell-nav-link">
              Carrinho{" "}
              {cartCount > 0 && (
                <span className="shell-badge">{cartCount}</span>
              )}
            </NavLink>
            <NavLink to="/checkout" className="shell-nav-link">
              Checkout
            </NavLink>
            <NavLink to="/demo" className="shell-nav-link shell-nav-link--demo">
              🧪 Lab
            </NavLink>
          </nav>
        </header>

        <main className="shell-main">
          {/* ── NÍVEL 2: Error Boundary POR ROTA (page) ── */}
          <ErrorBoundary
            level="page"
            onError={handleBoundaryError}
          >
            <Routes>
              <Route path="/" element={<CatalogoWithBoundaries />} />
              <Route path="/catalogo" element={<CatalogoWithBoundaries />} />
              <Route path="/carrinho" element={<CarrinhoWithBoundaries />} />
              <Route
                path="/checkout"
                element={
                  /* Checkout envolvido em boundary próprio para isolar erros críticos */
                  <ErrorBoundary level="page" onError={handleBoundaryError}>
                    <CheckoutPage />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/demo"
                element={
                  <ErrorBoundary level="page" onError={handleBoundaryError}>
                    <DemoPage />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* ── Log de erros capturados ── */}
        {errorLog.length > 0 && (
          <aside className="error-log">
            <div className="error-log-header">
              <span>📋 Erros capturados por Error Boundaries ({errorLog.length})</span>
              <button
                className="error-log-clear"
                onClick={() => setErrorLog([])}
              >
                Limpar
              </button>
            </div>
            {errorLog.map((entry, i) => (
              <div key={i} className="error-log-entry">
                <span className="error-log-time">{entry.time}</span>
                <span className="error-log-msg">{entry.message}</span>
              </div>
            ))}
          </aside>
        )}

        <footer className="shell-footer">
          <p>MFE E-Commerce — Demonstração de Error Boundaries com Vite + React</p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
