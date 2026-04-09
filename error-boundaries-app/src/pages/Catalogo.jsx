import React, { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import EventBus from "../store/eventBus";
import products from "../data/products";

/**
 * Catálogo de Produtos
 *
 * Demonstra Error Boundary:
 *   - O componente ProductCard pode lançar um erro quando o produto
 *     tem id === 5 e o usuário clica em "Ver detalhes".
 *   - O erro fica isolado no card individual (widget-level boundary).
 */

/**
 * Componente que PROPOSITALMENTE lança erro ao clicar em "Ver Detalhes"
 * de um produto específico (id=5). Demonstra erro durante render.
 */
function ProductCard({ product }) {
  const [showDetails, setShowDetails] = useState(false);

  // Simulação de bug: erro ao tentar renderizar detalhes do produto 5
  if (showDetails && product.id === 5) {
    throw new Error(
      `O produto "${product.name}" não está disponível no momento.`
    );
  }

  const handleAddToCart = () => {
    EventBus.emit("ADD_TO_CART", { product });
  };

  return (
    <Card className="catalogo-card">
      <img src={product.image} alt={product.name} className="catalogo-img" />
      <h3 className="catalogo-product-name">{product.name}</h3>
      <p className="catalogo-product-desc">{product.description}</p>

      {showDetails && (
        <div className="catalogo-details">
          <p>SKU: PROD-{product.id.toString().padStart(4, "0")}</p>
          <p>Estoque: {Math.floor(Math.random() * 50) + 1} unidades</p>
        </div>
      )}

      <div className="catalogo-product-footer">
        <span className="catalogo-price">R$ {product.price.toFixed(2)}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Ocultar" : "Detalhes"}
          </Button>
          <Button onClick={handleAddToCart}>Comprar</Button>
        </div>
      </div>
    </Card>
  );
}

// Exportamos o ProductCard separadamente para que o App possa envolvê-lo
// em um ErrorBoundary individual
export { ProductCard };

const CatalogoPage = () => {
  return (
    <div className="catalogo">
      <h2 className="catalogo-title">📦 Catálogo de Produtos</h2>
      <p className="catalogo-subtitle">
        Clique em "Detalhes" no produto <strong>Garrafa Node.js</strong> para
        simular um erro isolado por Error Boundary.
      </p>
      <div className="catalogo-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CatalogoPage;
