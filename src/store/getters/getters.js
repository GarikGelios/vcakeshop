export default {
  GET_SPREADSHEETS (state) {
    return state.spreadsheets // реактивно получает данные из массива spreadsheets: [], который в state
  },
  GET_WINDOW_TYPE (state) {
    return state.windowSize
  },
  GET_PROCESSED_SPREADSHEETS (state) {
    return state.products
  },
  GET_CART (state) {
    return state.cart
  },
  GET_COUNT_CAKE_IN_CART (state) {
    return state.cakeInCart
  }
}
