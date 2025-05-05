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
// @ - Alias cho thư mục src, đại diện cho thư mục src trong Vue CLI, giúp viết đường dẫn nhanh gọn hơn
// Còn .. là cách viết đường dẫn tương đối, cách viết mặc định của javascript, chỉ ra thư mục cha của thư mục hiện tại

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
  // Admin login route
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboard,
    children: [
      { path: 'dashboard', name: 'AdminDashboardHome', component: AdminDashboardHome },
      { path: 'dich-vu/danh-sach', name: 'AdminServiceList', component: AdminServiceList },
      { path: 'dich-vu/them-moi', name: 'AdminInsertService', component: AdminInsertService },
      { path: 'dich-vu/thung-rac', name: 'AdminTrashService', component: AdminTrashService },
      { path: 'dich-vu/chinh-sua/:id', name: 'AdminEditService', component: AdminEditService, meta: { requiresAuth: true } },
      { path: 'tin-tuc/danh-sach', name: 'AdminNewsList', component: AdminNewsList },
      { path: 'tin-tuc/them-moi', name: 'AdminInsertNews', component: AdminInsertNews },
      { path: 'tin-tuc/chinh-sua/:id', name: 'AdminEditNews', component: AdminEditNews, meta: { requiresAuth: true } },
      { path: 'tin-tuc/thung-rac', name: 'AdminTrashNews', component: AdminTrashNews, meta: { requiresAuth: true, title: 'Thùng rác tin tức' } },
      { path: 'don-hang/danh-sach', name: 'AdminOrderList', component: AdminOrderList },
      { path: 'don-hang/cho-duyet', name: 'AdminPendingOrders', component: AdminPendingOrders },
      { path: 'don-hang/lich-su', name: 'AdminOrderHistory', component: AdminOrderHistory },
      { path: 'thanh-toan/danh-sach', name: 'AdminPaymentList', component: AdminPaymentList },
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
    // Nếu có vị trí scroll đã lưu (như khi nhấn nút back/forward)
    if (savedPosition) {
      return savedPosition;
    } else {
      // Mặc định scroll lên đầu trang
      return { top: 0 };
    }
  }
})

// Route guard: bảo vệ các route admin
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    const isLoggedIn = !!localStorage.getItem('adminToken');
    if (!isLoggedIn) {
      return next('/admin/login');
    }
  }
  next();
});

export default router
