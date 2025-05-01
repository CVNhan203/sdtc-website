import { createRouter, createWebHistory } from 'vue-router'
import ComNews from '../components/view/ComNews.vue'
import ComNewsDetail from '../components/view/ComNewsDetail.vue'
// import AdminLogin from '../components/admin/login.vue'
import ComPriceList from '../components/view/ComPriceList.vue'
import AdminDashboard from '../components/admin/Dashboard.vue'
import AdminServiceList from '../components/admin/service/ServiceList.vue'
import AdminNewsList from '../components/admin/news/NewsList.vue'
import AdminInsertNews from '../components/admin/news/InsertNews.vue'
import AdminEditNews from '../components/admin/news/EditNews.vue'
import AdminTrashNews from '../components/admin/news/TrashNews.vue'
import AdminOrderList from '../components/admin/order/OrderList.vue'
import AdminPaymentList from '../components/admin/payment/PaymentList.vue'
import AdminInsertService from '../components/admin/service/InsertService.vue'
import AdminEditService from '../components/admin/service/EditService.vue'
import AdminTrashService from '../components/admin/service/TrashService.vue'

// Tạm thời bỏ qua auth guard
const requireAuth = (to, from, next) => {
  next()
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
    redirect: '/admin/dashboard'
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
            name: 'AdminEditService',
            component: AdminEditService,
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
            name: 'AdminInsertNews',
            component: AdminInsertNews,
          },
          {
            path: 'chinh-sua/:id',
            name: 'AdminEditNews',
            component: AdminEditNews,
            meta: { requiresAuth: true }
          },
          {
            path: 'thung-rac',
            name: 'AdminTrashNews',
            component: AdminTrashNews,
            meta: {
              requiresAuth: true,
              title: 'Thùng rác tin tức'
            }
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

// Tạm thời bỏ qua global navigation guard
router.beforeEach((to, from, next) => {
  next()
})

export default router
