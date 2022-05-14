import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store'

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
    meta:{ requiresAuth: true },
    children:[
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../components/dashboard.vue'),
        meta:{ requiresAuth: true },
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../components/order.vue'),
        meta:{ requiresAuth: true },
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('../components/product.vue'),
        meta:{ requiresAuth: true },
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../components/user.vue'),
        meta:{ requiresAuth: true },
      },
      {
        path: 'manager',
        name: 'Manager',
        component: () => import('../components/manager.vue'),
        meta:{ requiresAuth: true },
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    const token = localStorage.getItem('token')
    if(token !== ''){
      next()
    }else{
      next({ name: 'Login'})
    }
  }else{
    next()
  }
})
export default router
