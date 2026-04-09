import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import CartStore from "../store/cartStore";

/**
 * Carrinho de compras
 *
 * Demonstra Error Boundary no nível de SEÇÃO (section):
 *   - O resumo do pedido lança erro quando o total excede R$ 200.
 *   - O ErrorBoundary isola o resumo, sem quebrar a lista de itens.
 */

function CartSummary({ total, itemCount }) {
  // Simulação de bug: erro quando o total excede R$ 200
  if (total > 200) {
    throw new Error(
      `Falha ao calcular frete para pedidos acima de R$ 200,00 (total: R$ ${total.toFixed(2)})`
    );
  }

  return (
    <Card className="carrinho-summary">
      <h3>Resumo do Pedido</h3>
      <div className="carrinho-summary-row">
        <span>Itens ({itemCount})</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>
      <div className="carrinho-summary-row">
        <span>Frete</span>
        <span style={{ color: "#059669" }}>Grátis</span>
      </div>
      <div className="carrinho-summary-row carrinho-summary-total">
        <strong>Total</strong>
        <strong>R$ {total.toFixed(2)}</strong>
      </div>
    </Card>
  );
}

// Exportamos separadamente para envolver em ErrorBoundary
export { CartSummary };

const CarrinhoPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => CartStore.getItems());

  useEffect(() => {
    return CartStore.subscribe(({ items: updated }) => setItems(updated));
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

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
        Adicione mais de R$ 200 em produtos para simular um erro no resumo do pedido.
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

        {/* CartSummary será envolvido em ErrorBoundary no App.jsx */}
        <CartSummary total={total} itemCount={itemCount} />
      </div>

      <div className="carrinho-actions">
        <Button onClick={() => navigate("/checkout")} disabled={items.length === 0}>
          Ir para Checkout
        </Button>
      </div>
    </div>
  );
};

export default CarrinhoPage;
