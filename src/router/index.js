import { createRouter, createWebHashHistory } from 'vue-router'
import { permissionType, checkPermissionsId } from '@/service/permissions'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresAuth: false,
      permissionId: ''
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: '/home/dashboard',
    meta: {
      name: 'Home',
      requiresAuth: true,
      permissionId: permissionType.home_dashboard
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../components/dashboard.vue'),
        meta: {
          name: 'Dashboard',
          requiresAuth: true,
          permissionId: permissionType.home_dashboard
        }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('../components/order.vue'),
        meta: {
          name: '訂單管理',
          requiresAuth: true,
          permissionId: permissionType.order_manage_page
        }
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('../components/goods.vue'),
        meta: {
          name: '商品管理',
          requiresAuth: true,
          permissionId: permissionType.goods_manage_page
        }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../components/user.vue'),
        meta: {
          name: '會員管理',
          requiresAuth: true,
          permissionId: permissionType.member_manage_page
        }
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('../components/admin.vue'),
        meta: {
          name: '管理員列表',
          requiresAuth: true,
          permissionId: permissionType.admin_manage_page
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const userPermission = JSON.parse(localStorage.getItem('userPermissions'))
  if (to.meta.requiresAuth) {
    const allowance = checkPermissionsId(userPermission, to.meta.permissionId)
    if (userInfo.token !== '' && userInfo && allowance) {
      next()
    } else {
      next({ name: 'Login' })
      localStorage.removeItem('userPermissions')
      localStorage.removeItem('userInfo')
    }
  } else {
    next()
  }
})
export default router
