import { createWebHistory, createRouter } from "vue-router";
import Home from "@/components/view/ComHome.vue";
import Procedure from "@/components/view/ComProcedure.vue";
import Team from "@/components/view/ComTeam.vue";
import PriceList from "@/components/view/ComPriceList.vue";
import News from "@/components/view/ComNews.vue";
import Advise from "@/components/view/ComAdvise.vue";
// @ - Alias cho thư mục src, đại diện cho thư mục src trong Vue CLI, giúp viết đường dẫn nhanh gọn hơn 
// Còn .. là cách viết đường dẫn tương đối, cách viết mặc định của javascript, chỉ ra thư mục cha của thư mục hiện tại

const routes = [
    // Trang chủ
    {
        path: "/",
        name: "Home",
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
        component: PriceList,
    },
    // Trang tin tức
    {
        path: "/news",
        name: "News",
        component: News,
    },
    // Trang tư vấn
    {
        path: "/advise",
        name: "Advise",
        component: Advise,
    }
];

// tạo đối tượng router
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;