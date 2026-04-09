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
    </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

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
    name: "Garrafa Node.js",
    price: 59.9,
    image: productSvg("#16a34a", "🍶", "Garrafa Node.js"),
    description: "Garrafa térmica 500ml aço inoxidável.",
  },
  {
    id: 6,
    name: "Boné JavaScript",
    price: 44.9,
    image: productSvg("#eab308", "🧢", "Boné JavaScript"),
    description: "Boné snapback bordado com logo JS.",
  },
];

export default products;
