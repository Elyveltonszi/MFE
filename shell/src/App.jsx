import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
// Importar CartStore no shell garante que o listener global de ADD_TO_CART
// é registrado assim que a aplicação carrega (independente da rota ativa).
import CartStore from "shared/CartStore";
import "./App.css";

/**
 * Pilar de ROTEAMENTO:
 * Lazy loading dos MFEs — cada um é carregado sob demanda via Module Federation.
 * O shell controla as rotas de primeiro nível.
 */
const Catalogo = lazy(() => import("mfeCatalogo/CatalogoApp"));
const Carrinho = lazy(() => import("mfeCarrinho/CarrinhoApp"));
const Checkout = lazy(() => import("mfeCheckout/CheckoutApp"));

const Loading = () => (
  <div className="shell-loading">
    <div className="shell-spinner" />
    <p>Carregando módulo...</p>
  </div>
);

const App = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Shell assina o CartStore para exibir badge no menu
    const cleanup = CartStore.subscribe(({ items }) => {
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    });
    return cleanup;
  }, []);

  return (
    <BrowserRouter>
      <div className="shell-layout">
        <header className="shell-header">
          <div className="shell-logo">🛒 MFE Commerce</div>
          <nav className="shell-nav">
            <NavLink to="/catalogo" className="shell-nav-link">
              Catálogo
            </NavLink>
            <NavLink to="/carrinho" className="shell-nav-link">
              Carrinho {cartCount > 0 && <span className="shell-badge">{cartCount}</span>}
            </NavLink>
            <NavLink to="/checkout" className="shell-nav-link">
              Checkout
            </NavLink>
          </nav>
        </header>

        <main className="shell-main">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Catalogo />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/carrinho" element={<Carrinho />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="shell-footer">
          <p>MFE E-Commerce Portal — Arquitetura de Microfrontends</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
