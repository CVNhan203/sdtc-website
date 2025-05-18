import axios from 'axios'; // Nhập thư viện axios để thực hiện các yêu cầu HTTP

// Lấy hostname hiện tại
const currentHost = window.location.hostname;

// Tạo baseURL cho API
const API_BASE_URL = `http://${currentHost}:3000/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json' // Đặt header Content-Type mặc định là application/json
    }
});

// Thêm interceptor cho yêu cầu
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken'); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Nếu có token, thêm vào header Authorization
        }
        // Đối với FormData, cho phép trình duyệt tự động thiết lập Content-Type
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type']; // Xóa header Content-Type nếu đang gửi FormData
        }
        return config; // Trả về cấu hình đã chỉnh sửa
    },
    (error) => {
        return Promise.reject(error); // Ném lỗi nếu có
    }
);

// Thêm interceptor cho phản hồi
api.interceptors.response.use(
    (response) => response, // Trả về phản hồi nếu không có lỗi
    (error) => {
        // Kiểm tra nếu là API của admin và trả về lỗi 401
        if (error.response?.status === 401 && error.config.url.includes('/admin/')) {
            localStorage.removeItem('adminToken'); // Xóa token khỏi localStorage
            localStorage.removeItem('adminInfo'); // Xóa thông tin admin khỏi localStorage
            // window.location.href = '/admin/dashboard'; // Chỉ chuyển hướng nếu là API của admin
        }
        return Promise.reject(error); // Ném lỗi nếu có
    }
);

export default api; // Xuất đối tượng api để sử dụng ở nơi khác