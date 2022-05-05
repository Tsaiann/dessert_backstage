import request from '@/service/request'

export const userModules = {
  state:{
    userStatus:{
      username:'',
      token:''
    }
  },

  getters:{

  },
  
  mutations:{
    SET_TOKEN(state,token){
      state.userStatus.token = token
      localStorage.setItem('token',token)
    },
    DEL_TOKEN(state,token){
      localStorage.removeItem('token')
    }
  },
  
  actions:{
    setToken(context, payload){
      context.commit('SET_TOKEN', payload)
    }
  }
}

