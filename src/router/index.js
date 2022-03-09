import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect:'dashboard',
    children:[
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../components/dashboard.vue')
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../components/order.vue')
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('../components/product.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../components/user.vue')
      },
      {
        path: 'manager',
        name: 'Manager',
        component: () => import('../components/manager.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
