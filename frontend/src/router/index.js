import { createRouter, createWebHistory } from 'vue-router'
import ComNews from '../components/view/ComNews.vue'
import ComNewsDetail from '../components/view/ComNewsDetail.vue'
import AdminLogin from '../components/admin/login.vue'
import ComPriceList from '../components/view/ComPriceList.vue'
import AdminDashboard from '../components/admin/Dashboard.vue'
import AdminServiceList from '../components/admin/service/ServiceList.vue'
import AdminNewsList from '../components/admin/news/NewsList.vue'
import AdminOrderList from '../components/admin/order/OrderList.vue'
import AdminPaymentList from '../components/admin/payment/PaymentList.vue'
import AdminInsertService from '../components/admin/service/InsertService.vue'
import AdminTrashService from '../components/admin/service/TrashService.vue'

// Auth guard middleware
const requireAuth = (to, from, next) => {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    next('/admin')
  } else {
    next()
  }
}

const routes = [
  {
    path: '/tin-tuc',
    name: 'News',
    component: ComNews
  },
  {
    path: '/tin-tuc/:id',
    name: 'NewsDetail',
    component: ComNewsDetail
  },
  {
    path: '/bang-gia',
    name: 'PriceList',
    component: ComPriceList
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    beforeEnter: requireAuth,
    children: [
      {
        path: '/admin/dich-vu',
        children: [
          {
            path: 'danh-sach',
            name: 'AdminServiceList',
            component: AdminServiceList,
          },
          {
            path: 'them-moi',
            name: 'AdminInsertService',
            component: AdminInsertService,
          },
          {
            path: 'thung-rac',
            name: 'AdminTrashService',
            component: AdminTrashService,
          },
          {
            path: 'chinh-sua/:id',
            name: 'EditService',
            component: () => import('@/components/admin/service/EditService.vue'),
            meta: { requiresAuth: true }
          }
        ]
      },
      {
        path: '/admin/tin-tuc',
        children: [
          {
            path: 'danh-sach',
            name: 'AdminNewsList',
            component: AdminNewsList,
          },
          {
            path: 'them-moi',
            name: 'AdminNewsAdd',
            component: AdminNewsList,
          }
        ]
      },
      {
        path: '/admin/don-hang',
        children: [
          {
            path: 'danh-sach',
            name: 'AdminOrderList',
            component: AdminOrderList,
          }
        ]
      },
      {
        path: '/admin/thanh-toan',
        children: [
          {
            path: 'danh-sach',
            name: 'AdminPaymentList',
            component: AdminPaymentList,
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')
  
  // Nếu đã đăng nhập và cố truy cập trang login
  if (to.path === '/admin' && token) {
    next('/admin/dashboard')
    return
  }

  // Nếu chưa đăng nhập và cố truy cập trang admin
  if (to.path.startsWith('/admin/') && !token && to.path !== '/admin') {
    next('/admin')
    return
  }

  next()
})

export default router
