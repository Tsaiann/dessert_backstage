import request from '@/service/request'

export const userModules = {
  namespaced: true,
  state: {
    userStatus: {
      id: null,
      account: '',
      username: '',
      token: ''
    },
    userPermissions: {}
  },

  getters: {
    getToken(state) {
      if (!state.token) {
        state.userStatus.token = localStorage.getItem('token')
      }
      return state.userStatus.token
    }
  },

  mutations: {
    SET_USERSTATUS(state, payload) {
      state.userStatus.id = payload.Info.ID
      state.userStatus.account = payload.Info.Account
      state.userStatus.username = payload.Info.Name
      state.userStatus.token = payload.Token
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ id: payload.Info.ID, account: payload.Info.Account, username: payload.Info.Name, token: payload.Token })
      )
    },
    SET_USERPERMISSIONS(state, payload) {
      state.userPermissions = JSON.parse(JSON.stringify(payload))
      localStorage.setItem('userPermissions', JSON.stringify(payload))
    },
    LOGOUT(state) {
      state.userStatus = {
        id: null,
        account: '',
        username: '',
        token: ''
      }
      localStorage.removeItem('userInfo')
      localStorage.removeItem('userPermissions')
    }
  },

  actions: {}
}
