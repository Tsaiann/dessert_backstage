<template>
  <div class="login row vertical" data-width="20%">
    <p>使用者帳號</p>
    <el-input v-model="loginForm.user" type="text" placeholder="請輸入帳號"  data-space-bottom="0.5rem"/>
    <p>密碼</p>
    <el-input v-model="loginForm.pwd" type="password" placeholder="請輸入密碼" data-space-bottom="0.5rem"/>
    <p>驗證碼</p>
    <div class="row horizontal">
      <el-input v-model="loginForm.otp" type="text"  data-space-bottom="1rem"/>
      <div class="otp">4768</div>
    </div>
    <div class="row horizontal center">
      <el-button type="primary" @click="hanleLogin()" >登入</el-button>
      <el-button @click="removeLogin()">清除</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '@/service/api'

export default {
  name:'Login',
  setup(){
    const router = useRouter()
    const loginForm = reactive({
      user:'',
      pwd:'',
      otp:''
    })
    const hanleLogin = () =>{
      if( loginForm.user !=='' && loginForm.pwd !== '' && loginForm.otp !=='' ){
        request({
          url:'/postman',
          method:'get',
          data:{
            name: loginForm.user,
            pwd: loginForm.pwd,
            otp: loginForm.otp
          },
        })
        //router.push({ name: 'Dashboard' }) 
      }else if( loginForm.user =='' ){
        alert('帳號不能為空')
      }else if( loginForm.pwd =='' ){
        alert('密碼不能為空')
      }else if( loginForm.otp =='' ){
        alert('驗證碼不能為空')
      }
    }
    /*const hanleLogin = async() =>{
      if( user !=='' && pwd !=='' && otp !==''){
          await api.post(service.baseURL, loginForm)
          let token = response.data.token
          Cookies.set('token', JSON.stringify(token))
          router.push({ name: 'Dashboard' }) 
      }
    }*/
    const removeLogin = () => {
      loginForm.user='',
      loginForm.pwd=''
    }
    return{
      loginForm,
      hanleLogin,
      removeLogin,
    }
  }
}
</script>