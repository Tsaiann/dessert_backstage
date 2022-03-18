import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import api from '@/service/api'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import '@/styles/style.scss'

const app = createApp(App)
app.use(VueAxios, axios)
app.use(store)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$api = api
app.mount('#app')