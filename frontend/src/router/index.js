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
import Home from '@/components/view/ComHome.vue'
import Procedure from '@/components/view/ComProcedure.vue'
import Team from '@/components/view/ComTeam.vue'
import PriceList from '@/components/view/ComPriceList.vue'
import News from '@/components/view/ComNews.vue'
import Advise from '@/components/view/ComAdvise.vue'
import AdminDashboardHome from '../components/admin/AdminDashboardHome.vue'
import AccountList from '../components/admin/account/AccountList.vue'
import AddAccount from '../components/admin/account/AddAccount.vue'
import EditAccount from '../components/admin/account/EditAccount.vue'
import TrashAccount from '../components/admin/account/TrashAccount.vue'; // Import the TrashAccounts component

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/procedure',
    name: 'Procedure',
    component: Procedure,
  },
  {
    path: '/team',
    name: 'Team',
    component: Team,
  },
  {
    path: '/price-list',
    name: 'PriceList',
    component: PriceList,
  },
  {
    path: '/news',
    name: 'News',
    component: News,
  },
  {
    path: '/tin-tuc',
    name: 'ComNews',
    component: ComNews,
  },
  {
    path: '/tin-tuc/:id',
    name: 'ComNewsDetail',
    component: ComNewsDetail,
  },
  {
    path: '/bang-gia',
    name: 'ComPriceList',
    component: ComPriceList,
  },
  {
    path: '/advise',
    name: 'Advise',
    component: Advise,
  },
  // Admin routes
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    meta: { requiresAuth: true },
    children: [
      { 
        path: 'dashboard', 
        name: 'AdminDashboardHome', 
        component: AdminDashboardHome,
        meta: { requiresAuth: true }
      },
      { 
        path: 'dich-vu/danh-sach', 
        name: 'AdminServiceList', 
        component: AdminServiceList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'dich-vu/them-moi', 
        name: 'AdminInsertService', 
        component: AdminInsertService,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'dich-vu/thung-rac', 
        name: 'AdminTrashService', 
        component: AdminTrashService,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'dich-vu/chinh-sua/:id', 
        name: 'AdminEditService', 
        component: AdminEditService, 
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'tin-tuc/danh-sach', 
        name: 'AdminNewsList', 
        component: AdminNewsList,
        meta: { requiresAuth: true }
      },
      { 
        path: 'tin-tuc/them-moi', 
        name: 'AdminInsertNews', 
        component: AdminInsertNews,
        meta: { requiresAuth: true }
      },
      { 
        path: 'tin-tuc/chinh-sua/:id', 
        name: 'AdminEditNews', 
        component: AdminEditNews, 
        meta: { requiresAuth: true }
      },
      { 
        path: 'tin-tuc/thung-rac', 
        name: 'AdminTrashNews', 
        component: AdminTrashNews, 
        meta: { requiresAuth: true }
      },
      { 
        path: 'don-hang/danh-sach', 
        name: 'AdminOrderList', 
        component: AdminOrderList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'don-hang/cho-duyet', 
        name: 'AdminPendingOrders', 
        component: AdminPendingOrders,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'don-hang/lich-su', 
        name: 'AdminOrderHistory', 
        component: AdminOrderHistory,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'thanh-toan/danh-sach', 
        name: 'AdminPaymentList', 
        component: AdminPaymentList,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'tai-khoan/danh-sach', 
        name: 'AccountList', 
        component: AccountList, 
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'tai-khoan/them-moi', 
        name: 'AddAccount', 
        component: AddAccount, 
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'tai-khoan/chinh-sua/:id', 
        name: 'EditAccount', 
        component: EditAccount, 
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      { 
        path: 'tai-khoan/thung-rac', 
        name: 'TrashAccount', 
        component: TrashAccount, 
        meta: { requiresAuth: true, requiresAdmin: true }
      },
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
})

// Route guard
router.beforeEach((to, from, next) => {
  // Check authentication for admin routes
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      return next('/admin/login');
    }
    
    // Check role permissions
    const adminInfoString = localStorage.getItem('adminInfo');
    if (adminInfoString) {
      try {
        const adminInfo = JSON.parse(adminInfoString);
        const isStaff = adminInfo.role === 'staff';
        
        // If staff trying to access admin-only routes
        if (isStaff && to.meta.requiresAdmin) {
          console.log('Staff attempting to access admin-only area');
          return next('/admin/tin-tuc/danh-sach');
        }

        // If staff trying to access non-news routes
        if (isStaff && !to.path.includes('/admin/tin-tuc')) {
          console.log('Staff redirected to news section');
          return next('/admin/tin-tuc/danh-sach');
        }
      } catch (error) {
        console.error('Error parsing admin info:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        return next('/admin/login');
      }
    }
  }
  next();
});

export default router