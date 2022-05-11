import request from '@/service/request'
import Cookies from 'js-cookie'

export const userModules = {
  namespaced: true,
  state:{
    userStatus:{
      username:'',
      token:'',
      isLogin: false,
    }
  },

  getters:{
    getToken(state){
      if(!state.token){
        state.token = Cookies.get('token')
      }
      return state.token
    }
  },
  
  mutations:{
    SET_TOKEN(state, payload){
      Cookies.set('token', payload)
      state.userStatus.token = payload
    },
    DEL_TOKEN(state){
      state.userStatus.token = ''
      localStorage.removeItem('token')
    }
  },
  
  actions:{

  }
}

