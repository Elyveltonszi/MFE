/**
 * Gera um SVG inline como data URI para imagem de produto.
 * Cada produto tem cor, ícone e label únicos.
 */
function productSvg(bgColor, icon, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="280" height="200" viewBox="0 0 280 200">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${bgColor}dd;stop-opacity:1"/>
        </linearGradient>
      </defs>
      <rect width="280" height="200" rx="8" fill="url(#bg)"/>
      <text x="140" y="90" text-anchor="middle" font-size="52">${icon}</text>
      <text x="140" y="135" text-anchor="middle"
            font-family="Segoe UI,system-ui,sans-serif" font-size="16"
            font-weight="600" fill="#fff">${label}</text>
      <rect x="20" y="165" width="240" height="1" fill="rgba(255,255,255,0.2)"/>
      <text x="140" y="185" text-anchor="middle"
            font-family="Segoe UI,system-ui,sans-serif" font-size="11"
            fill="rgba(255,255,255,0.7)">MFE Commerce</text>
    </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Dados mockados de produtos.
 * Em produção, viria de uma API REST/GraphQL.
 */
const products = [
  {
    id: 1,
    name: "Camiseta React",
    price: 79.9,
    image: productSvg("#4f46e5", "👕", "Camiseta React"),
    description: "Camiseta 100% algodão com estampa React.",
  },
  {
    id: 2,
    name: "Caneca TypeScript",
    price: 49.9,
    image: productSvg("#0284c7", "☕", "Caneca TypeScript"),
    description: "Caneca de cerâmica 350ml para devs.",
  },
  {
    id: 3,
    name: "Adesivo Pack Frontend",
    price: 19.9,
    image: productSvg("#059669", "🏷️", "Adesivo Pack"),
    description: "Pack com 10 adesivos de tecnologias frontend.",
  },
  {
    id: 4,
    name: "Mouse Pad Dev",
    price: 39.9,
    image: productSvg("#7c3aed", "🖱️", "Mouse Pad Dev"),
    description: "Mouse pad extended com atalhos de teclado.",
  },
  {
    id: 5,
    name: "Boné Node.js",
    price: 59.9,
    image: productSvg("#16a34a", "🧢", "Boné Node.js"),
    description: "Boné ajustável bordado Node.js.",
  },
  {
    id: 6,
    name: "Garrafa Webpack",
    price: 69.9,
    image: productSvg("#ea580c", "🧴", "Garrafa Webpack"),
    description: "Garrafa térmica 500ml com logo Webpack.",
  },
];

export default products;
