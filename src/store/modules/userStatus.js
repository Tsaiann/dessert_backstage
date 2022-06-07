import request from '@/service/request'

export const userModules = {
  namespaced: true,
  state: {
    userStatus: {
      username: '',
      token: '',
      isLogin: false
    }
  },

  getters: {
    getToken(state) {
      if (!state.token) {
        state.token = localStorage.getItem('token')
      }
      return state.token
    }
  },

  mutations: {
    SET_TOKEN(state, payload) {
      localStorage.setItem('token', payload)
      state.userStatus.token = payload
    },
    DEL_TOKEN(state) {
      state.userStatus.token = ''
      localStorage.removeItem('token')
    }
  },

  actions: {}
}
