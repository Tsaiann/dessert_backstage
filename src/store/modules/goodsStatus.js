export const goodsModules = {
  namespaced: true,
  state: {
    goodsStatus: []
  },

  getters: {},

  mutations: {
    SET_GOODSTATUS(state, payload) {
      console.log('goodsStatus store', payload)
      state.goodsStatus = [...payload]
      localStorage.setItem('goodsInfo', JSON.stringify([...payload]))
    }
  },

  actions: {}
}
