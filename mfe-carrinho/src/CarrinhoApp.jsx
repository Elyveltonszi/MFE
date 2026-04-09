import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "shared/Button";
import Card from "shared/Card";
import CartStore from "shared/CartStore";
import "./CarrinhoApp.css";

/**
 * MFE Carrinho — Listagem de itens, quantidades e total
 *
 * Pilar de COMUNICAÇÃO:
 *   Usa o CartStore (estado global persistente) em vez de escutar
 *   eventos diretamente. O CartStore mantém os itens mesmo quando
 *   este componente não está montado.
 *
 * Pilar de COMPONENTIZAÇÃO:
 *   Usa <Button> e <Card> da biblioteca compartilhada.
 */
const CarrinhoApp = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => CartStore.getItems());

  useEffect(() => {
    const cleanup = CartStore.subscribe(({ items: updated }) => {
      setItems(updated);
    });
    return cleanup;
  }, []);

  const updateQuantity = (id, delta) => {
    CartStore.updateQuantity(id, delta);
  };

  const removeItem = (id) => {
    CartStore.removeItem(id);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
                onClick={() => updateQuantity(item.id, -1)}
              >
                −
              </Button>
              <span className="carrinho-qty-value">{item.quantity}</span>
              <Button
                variant="secondary"
                onClick={() => updateQuantity(item.id, 1)}
              >
                +
              </Button>
            </div>
            <span className="carrinho-item-subtotal">
              R$ {(item.price * item.quantity).toFixed(2)}
            </span>
            <Button variant="danger" onClick={() => removeItem(item.id)}>
              ✕
            </Button>
          </Card>
        ))}
      </div>

      <Card className="carrinho-total">
        <div className="carrinho-total-row">
          <span>Total ({items.reduce((s, i) => s + i.quantity, 0)} itens)</span>
          <strong className="carrinho-total-value">
            R$ {total.toFixed(2)}
          </strong>
        </div>
        <div className="carrinho-checkout-action">
          <Button onClick={() => navigate("/checkout")}>
            Finalizar Compra →
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CarrinhoApp;
