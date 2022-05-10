import { createRouter, createWebHashHistory } from 'vue-router'
import Cookies from 'js-cookie'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect:'/home/dashboard',
    children:[
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../components/dashboard.vue'),
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../components/order.vue'),
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('../components/product.vue'),
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../components/user.vue'),
      },
      {
        path: 'manager',
        name: 'Manager',
        component: () => import('../components/manager.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async(to, from, next) => {
  if(to.meta.requireAuth){
    const userInfo = Cookies.get('login')
    if(userInfo){
      const token = JSON.parse(userInfo).token
      if(token.length > 0){
        next()
      }else{
        next({ name: 'Login'})
      }
    }else{
        next({ name: 'Login'})
    }
  }else{
    next()
  }
})
export default router
