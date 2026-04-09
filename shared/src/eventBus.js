/**
 * Event Bus — Pilar de COMUNICAÇÃO entre Microfrontends
 *
 * Implementa o padrão Pub/Sub usando Custom Events do browser.
 * Cada MFE pode emitir e escutar eventos sem dependência direta dos outros.
 *
 * Eventos do sistema:
 *   ADD_TO_CART    — { product }        — catálogo → carrinho
 *   REMOVE_FROM_CART — { productId }    — carrinho → interno
 *   CART_UPDATED   — { items, total }   — carrinho → qualquer
 *   CHECKOUT_DONE  — { order }          — checkout → shell
 */

const EventBus = {
  /**
   * Emite um evento customizado globalmente.
   * @param {string} event - Nome do evento (ex: 'ADD_TO_CART')
   * @param {*} detail - Payload do evento
   */
  emit(event, detail) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  },

  /**
   * Registra um listener para um evento.
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função que recebe o evento
   * @returns {Function} Função de cleanup para remover o listener
   */
  on(event, callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  },
};

export default EventBus;
