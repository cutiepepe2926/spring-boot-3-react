import axios from "axios";

const api = axios.create({
    baseURL: "/api", // setupProxy.js의 pathFilter('/api')에 맞춤 ->  이래야 서버로전달
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청마다 토큰 자동 첨부
api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 401/403 공통 처리: 토큰 삭제 후 로그인으로 강제 이동
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url;

        if (
            (status === 401 || status === 403) &&
            !requestUrl?.includes("/books/main")
        ) {
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");
            // 필요하면 alert 추가 가능
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

export default api;

// 사용 예시
// import api from "../api/api";
//
// 로그인
// await api.post("/auth/v1/login", { loginId, pw });
//
// 보호 API
// await api.get("/test"); // 실제 요청은 /api/test 로 나감
