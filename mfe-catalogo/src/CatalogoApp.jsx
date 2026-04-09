import React from "react";
import Button from "shared/Button";
import Card from "shared/Card";
import EventBus from "shared/EventBus";
import products from "./products";
import "./CatalogoApp.css";

/**
 * MFE Catálogo — Grid de Produtos
 *
 * Pilar de COMUNICAÇÃO:
 *   Ao clicar em "Adicionar ao carrinho", emite o evento ADD_TO_CART
 *   pelo EventBus. O mfe-carrinho escuta esse evento e atualiza seu estado.
 *
 * Pilar de COMPONENTIZAÇÃO:
 *   Usa <Button> e <Card> da biblioteca shared (Module Federation).
 */
const CatalogoApp = () => {
  const handleAddToCart = (product) => {
    EventBus.emit("ADD_TO_CART", { product });
  };

  return (
    <div className="catalogo">
      <h2 className="catalogo-title">📦 Catálogo de Produtos</h2>
      <p className="catalogo-subtitle">
        Navegue e adicione itens ao seu carrinho
      </p>

      <div className="catalogo-grid">
        {products.map((product) => (
          <Card key={product.id} className="catalogo-card">
            <img
              src={product.image}
              alt={product.name}
              className="catalogo-img"
            />
            <h3 className="catalogo-product-name">{product.name}</h3>
            <p className="catalogo-product-desc">{product.description}</p>
            <div className="catalogo-product-footer">
              <span className="catalogo-price">
                R$ {product.price.toFixed(2)}
              </span>
              <Button onClick={() => handleAddToCart(product)}>
                Adicionar ao carrinho
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CatalogoApp;
