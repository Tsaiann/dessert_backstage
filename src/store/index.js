import { createStore } from 'vuex'
import { userModules } from './modules/userStatus'
import { goodsModules } from './modules/goodsStatus'

export default createStore({
  modules: {
    userModules,
    goodsModules
  },
  state: {},

  mutations: {},

  getters: {},

  actions: {}
})
