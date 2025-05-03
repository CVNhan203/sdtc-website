import { createRouter, createWebHistory } from 'vue-router'
import ComNews from '../components/view/ComNews.vue'
import ComNewsDetail from '../components/view/ComNewsDetail.vue'
import AdminLogin from '../components/admin/login.vue'
import ComPriceList from '../components/view/ComPriceList.vue'
import AdminDashboard from '../components/admin/Dashboard.vue'
import AdminServiceList from '../components/admin/service/ServiceList.vue'
import AdminNewsList from '../components/admin/news/NewsList.vue'
import AdminInsertNews from '../components/admin/news/InsertNews.vue'
import AdminEditNews from '../components/admin/news/EditNews.vue'
import AdminTrashNews from '../components/admin/news/TrashNews.vue'
import AdminOrderList from '../components/admin/order/OrderList.vue'
import AdminPendingOrders from '../components/admin/order/PendingOrders.vue'
import AdminOrderHistory from '../components/admin/order/OrderHistory.vue'
import AdminPaymentList from '../components/admin/payment/PaymentList.vue'
import AdminInsertService from '../components/admin/service/InsertService.vue'
import AdminEditService from '../components/admin/service/EditService.vue'
import AdminTrashService from '../components/admin/service/TrashService.vue'
import Home from "@/components/view/ComHome.vue";
import Procedure from "@/components/view/ComProcedure.vue";
import Team from "@/components/view/ComTeam.vue";
import Advise from "@/components/view/ComAdvise.vue";


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // Trang quy trình
  {
      path: "/procedure",
      name: "Procedure",
      component: Procedure,
  },
  // Trang đội ngũ
  {
      path: "/team",
      name: "Team",
      component: Team,
  },
  // Trang bảng giá
  {
      path: "/price-list",
      name: "PriceList",
      component: ComPriceList,
  },
  {
    path: '/news',
    name: 'News',
    component: ComNews,
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: ComNewsDetail
  },
  {
    path: "/advise",
    name: "Advise",
    component: Advise,
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
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
          },
          {
            path: 'cho-duyet',
            name: 'AdminPendingOrders',
            component: AdminPendingOrders,
          },
          {
            path: 'lich-su',
            name: 'AdminOrderHistory',
            component: AdminOrderHistory,
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

export default router
