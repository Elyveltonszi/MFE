/**
 * Event Bus — Comunicação entre componentes via Custom Events.
 * Mesmo padrão do projeto MFE original.
 */
const EventBus = {
  emit(event, detail) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  },
  on(event, callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  },
};

export default EventBus;
