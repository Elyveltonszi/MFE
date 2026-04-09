import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import CartStore from "../store/cartStore";
import EventBus from "../store/eventBus";

/**
 * Checkout — Formulário de endereço + confirmação
 *
 * Demonstra Error Boundary no nível de PÁGINA (page).
 * Quando o usuário confirma o pedido com CEP "00000-000", simula
 * um erro crítico que quebra toda a página de checkout.
 */
const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState(() => CartStore.getItems());
  const [cartTotal, setCartTotal] = useState(() => CartStore.getTotal());
  const [step, setStep] = useState("form");
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    return CartStore.subscribe(({ items, total }) => {
      setCartItems(items);
      setCartTotal(total);
    });
  }, []);

  const handleChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep("confirmation");
  };

  const handleConfirm = () => {
    // Simulação de erro: CEP inválido
    if (address.zip === "00000-000" || address.zip === "00000000") {
      throw new Error(
        "Erro crítico no processamento do pedido: CEP inválido não aceito pelo gateway de pagamento!"
      );
    }

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

  if (step === "confirmation") {
    return (
      <div className="checkout">
        <h2 className="checkout-title">📋 Confirmar Pedido</h2>
        <Card className="checkout-review">
          <h3>Endereço de Entrega</h3>
          <p>
            {address.name}<br />
            {address.street}<br />
            {address.city} - {address.state}, {address.zip}
          </p>
        </Card>
        <Card className="checkout-review">
          <h3>Itens ({cartItems.length})</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-review-item">
              <span>{item.name} × {item.quantity}</span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-review-total">
            <strong>Total</strong>
            <strong>R$ {cartTotal.toFixed(2)}</strong>
          </div>
        </Card>
        <div className="checkout-actions">
          <Button variant="secondary" onClick={() => setStep("form")}>
            Voltar
          </Button>
          <Button onClick={handleConfirm}>Confirmar Pedido</Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <h2 className="checkout-title">💳 Checkout</h2>
        <Card className="carrinho-empty">
          <p>Seu carrinho está vazio.</p>
          <p>Adicione produtos antes de fazer checkout.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2 className="checkout-title">💳 Checkout</h2>
      <p className="checkout-subtitle">
        Use CEP <strong>00000-000</strong> para simular erro crítico na confirmação.
      </p>

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
            label="Rua"
            value={address.street}
            onChange={handleChange("street")}
            placeholder="Rua, número"
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
            <Button>Revisar Pedido</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CheckoutPage;
