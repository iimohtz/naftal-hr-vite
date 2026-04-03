import axios from 'axios';

const api = axios.create({
    baseURL: 'http://management-and-monitoring-of-staff-movement-pfe.test/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Attach token to every request automatically
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;