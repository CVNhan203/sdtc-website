import axios from 'axios';

// Tự động phát hiện địa chỉ IP hoặc hostname của máy đang truy cập
const currentHost = window.location.hostname;

// Nếu đang truy cập từ localhost, sử dụng localhost, nếu không thì sử dụng địa chỉ hiện tại
const apiHost = currentHost === 'localhost' ? 'localhost' : currentHost;

const api = axios.create({
    baseURL: `http://${apiHost}:3000/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // For FormData, let the browser set the Content-Type
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            window.location.href = '/admin/dashboard';
        }
        return Promise.reject(error);
    }
);

export default api;
