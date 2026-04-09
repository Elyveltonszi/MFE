import React, { useState, useEffect } from "react";
import Button from "shared/Button";
import Card from "shared/Card";
import Input from "shared/Input";
import CartStore from "shared/CartStore";
import EventBus from "shared/EventBus";
import "./CheckoutApp.css";

/**
 * MFE Checkout — Formulário de endereço + Tela de confirmação
 *
 * Pilar de COMUNICAÇÃO:
 *   - Lê o CartStore para exibir resumo do pedido.
 *   - Emite CHECKOUT_DONE quando o pedido é finalizado.
 *
 * Pilar de COMPONENTIZAÇÃO:
 *   Usa <Button>, <Card> e <Input> da biblioteca shared.
 */
const CheckoutApp = () => {
  const [cartItems, setCartItems] = useState(() => CartStore.getItems());
  const [cartTotal, setCartTotal] = useState(() => CartStore.getTotal());
  const [step, setStep] = useState("form"); // "form" ou "confirmation"
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    const cleanup = CartStore.subscribe(({ items, total }) => {
      setCartItems(items);
      setCartTotal(total);
    });
    return cleanup;
  }, []);

  const handleChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep("confirmation");
  };

  const handleConfirm = () => {
    const order = {
      id: Date.now(),
      items: cartItems,
      total: cartTotal,
      address,
      date: new Date().toLocaleDateString("pt-BR"),
    };
    EventBus.emit("CHECKOUT_DONE", { order });
    CartStore.clear();
    setStep("done");
  };

  // Tela de sucesso
  if (step === "done") {
    return (
      <div className="checkout">
        <Card className="checkout-success">
          <div className="checkout-success-icon">✅</div>
          <h2>Pedido Confirmado!</h2>
          <p>Seu pedido foi enviado com sucesso.</p>
          <p className="checkout-success-detail">
            Entrega em: {address.street}, {address.city} - {address.state}
          </p>
        </Card>
      </div>
    );
  }

  // Tela de confirmação
  if (step === "confirmation") {
    return (
      <div className="checkout">
        <h2 className="checkout-title">📋 Confirmar Pedido</h2>

        <Card className="checkout-review">
          <h3>Endereço de Entrega</h3>
          <p>{address.name}</p>
          <p>
            {address.street}, {address.city} - {address.state}
          </p>
          <p>CEP: {address.zip}</p>
        </Card>

        <Card className="checkout-review">
          <h3>Itens do Pedido</h3>
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-review-item">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-review-total">
                <strong>Total</strong>
                <strong>R$ {cartTotal.toFixed(2)}</strong>
              </div>
            </>
          ) : (
            <p className="checkout-empty">Nenhum item no carrinho.</p>
          )}
        </Card>

        <div className="checkout-actions">
          <Button variant="secondary" onClick={() => setStep("form")}>
            ← Voltar
          </Button>
          <Button onClick={handleConfirm} disabled={cartItems.length === 0}>
            Confirmar Pedido
          </Button>
        </div>
      </div>
    );
  }

  // Formulário de endereço
  return (
    <div className="checkout">
      <h2 className="checkout-title">📦 Checkout</h2>
      <p className="checkout-subtitle">Preencha o endereço de entrega</p>

      <Card>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            value={address.name}
            onChange={handleChange("name")}
            placeholder="Seu nome"
            required
          />
          <Input
            label="Rua / Endereço"
            value={address.street}
            onChange={handleChange("street")}
            placeholder="Rua, número, complemento"
            required
          />
          <div className="checkout-row">
            <Input
              label="Cidade"
              value={address.city}
              onChange={handleChange("city")}
              placeholder="Cidade"
              required
            />
            <Input
              label="Estado"
              value={address.state}
              onChange={handleChange("state")}
              placeholder="UF"
              required
            />
          </div>
          <Input
            label="CEP"
            value={address.zip}
            onChange={handleChange("zip")}
            placeholder="00000-000"
            required
          />
          <div className="checkout-actions">
            <Button>Revisar Pedido →</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CheckoutApp;
