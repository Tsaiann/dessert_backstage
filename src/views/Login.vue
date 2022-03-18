<template>
  <div class="login row vertical" data-width="20%">
    <el-input :model="loginForm.username" type="text" placeholder="請輸入帳號" />
    <el-input :model="loginForm.password" type="password" placeholder="請輸入密碼" data-space-bottom="1rem"/>
    <div class="row horizontal center">
      <el-button type="primary">登入</el-button>
      <el-button>清除</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeMount} from 'vue'

export default {
  name:'Login',
  setup(){
    
    let loginForm =reactive({
      username:'',
      password:'',
      token:''
    })
    return{
      loginForm,
      
    }
  }
}
</script>