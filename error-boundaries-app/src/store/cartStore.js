import EventBus from "./eventBus";

let items = [];
let subscribers = [];

function notify() {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const snapshot = { items: [...items], total };
  subscribers.forEach((fn) => fn(snapshot));
  EventBus.emit("CART_UPDATED", snapshot);
}

EventBus.on("ADD_TO_CART", ({ product }) => {
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ ...product, quantity: 1 });
  }
  notify();
});

const CartStore = {
  getItems: () => [...items],
  getTotal: () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  subscribe(fn) {
    subscribers.push(fn);
    return () => {
      subscribers = subscribers.filter((s) => s !== fn);
    };
  },

  updateQuantity(id, delta) {
    items = items
      .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
      .filter((i) => i.quantity > 0);
    notify();
  },

  removeItem(id) {
    items = items.filter((i) => i.id !== id);
    notify();
  },

  clear() {
    items = [];
    notify();
  },
};

export default CartStore;
