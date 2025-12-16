# 인증/보안(로그인) 연동 가이드 (React SPA + Spring Boot + Access JWT)

이 문서는 **React(SPA) + Spring Boot(분리 서버)** 환경에서, 현재 프로젝트가 적용한 **Access JWT 인증 흐름**을 기준으로  
다른 기능(도서/채팅/기타 API) 담당자들이 안전하게 연동할 수 있도록 정리한 **README.md** 입니다.

---

## 1. 현재 인증 구조 요약

- Front: **React SPA**
- Back: **Spring Boot**
- 인증 토큰: **Access Token(JWT)만 사용**
- 토큰 저장: `localStorage` 또는 `sessionStorage`
- 요청 시 토큰 전달 방식:
  - `Authorization: Bearer <accessToken>`
- 토큰 유효성 확인용 공용 API:
  - `GET /api/me`
  - 성공(200): `{ "loginId": "..." }`
  - 실패(401/403): 토큰 무효/만료/위조

---

## 2. Front-end 필수 규칙

### 2.1 CRA 프록시 규칙(`/api` → 백엔드)

`/api` 로 시작하는 요청은 백엔드(8080)로 전달됩니다.

**`src/setupProxy.js`**
```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      pathFilter: "/api",
    })
  );
};
```
✅ 프론트에서 백엔드 호출은 반드시 /api/... 형태로 요청해야 프록시를 탑니다.

❌ 프론트 코드에서 http://localhost:8080 직접 호출은 지양(환경별 설정 꼬임 방지).

### 2.2 axios 직접 사용 금지(필수) → 공통 인스턴스 api.js 사용
토큰 자동 첨부/401·403 공통 처리를 위해 axios를 직접 import해서 쓰지 않습니다.
반드시 api.js를 사용합니다.

src/api/api.js

```js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // setupProxy.js의 /api 프록시 규칙과 맞춤
  headers: { "Content-Type": "application/json" },
});

// 요청: 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답: 401/403 공통 처리(토큰 삭제 후 로그인 이동)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  }
);

export default api;
```
사용 예시

```js
import api from "../api/api";

const res = await api.get("/books"); // 실제 요청: /api/books
const res2 = await api.post("/chat", dto);
```
### 2.3 “토큰 존재 = 로그인”으로 판단 금지(필수)
토큰이 저장소에 남아 있어도 만료/위조일 수 있습니다.
로그인 상태 확정은 반드시 GET /api/me로 확인합니다.

공통 패턴

```js
import api from "../api/api";

api.get("/me")
  .then((res) => {
    // 로그인 상태 확정 + loginId 확보
    setLoginId(res.data.loginId);
  })
  .catch(() => {
    // 토큰 무효/만료 → 토큰 삭제 + 비로그인 처리
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    setLoginId(null);
  });
```
### 2.4 인증 필요 페이지 보호(ProtectedRoute)
인증이 필요한 페이지(/chat 등)는 ProtectedRoute로 감싸세요.

src/routes/ProtectedRoute.js

```js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!token) return <Navigate to="/auth/login" replace />;
  return children;
}
```
적용 예시

```js
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>
```

## 3. Back-end 필수 규칙
### 3.1 로그인 사용자 식별 방법(필수)
JWT subject에 loginId가 들어있습니다.
컨트롤러에서 로그인 사용자는 아래 방식으로 가져옵니다.

```java
@GetMapping("/api/something")
public Object something(Authentication authentication) {
    String loginId = authentication.getName(); // = JWT subject(loginId)
    ...
}
```
✅ 인증 이후 사용자 식별은 항상 authentication.getName() 사용

❌ request body/param으로 loginId를 다시 받는 방식은 위변조 위험이 있어 금지

### 3.2 토큰 유효성 확인 API: GET /api/me (공용)
프론트의 로그인 상태 확정, UI 표시 등에 사용됩니다.

```java
@RestController
public class MeController {
    @GetMapping("/api/me")
    public Map<String, Object> me(Authentication authentication) {
        return Map.of("loginId", authentication.getName());
    }
}
```

### 3.3 Security 보호 정책
/api/auth/v1/** : 로그인/회원가입 관련 → permitAll

그 외 API: 기본적으로 authenticated() 적용(보호)

공개 API가 필요하면 해당 경로만 예외로 permitAll 추가하세요.

## 4. Postman / 디버깅 체크리스트
### 4.1 보호 API 호출 시 헤더(필수)
Authorization: Bearer <토큰>

정상 기대 결과

토큰 없음 → 401/403 (정상: 보호됨)

토큰 있음(유효) → 200 (정상: 통과)

## 5. 자주 발생하는 실수(필독)
### 5.1 Front-end 실수
❌ axios 직접 사용 → Authorization 누락
✅ api.js만 사용

❌ /api prefix 누락 → 3000에서 404
✅ api.get("/xxx") 형태로 호출(baseURL=/api)

❌ 토큰만 있으면 로그인이라고 가정
✅ GET /api/me로 유효성 확인

### 5.2 Back-end 실수
❌ 인증된 사용자 loginId를 request body로 받음
✅ authentication.getName() 사용

❌ 보호 API를 permitAll로 열어둠
✅ 기본 authenticated(), 예외만 permitAll

## 6. 연동 시 필수 준수 요약(최종)
프론트 API 호출은 무조건 api.js 사용

로그인 상태 확정은 무조건 GET /api/me

인증 필요 페이지는 ProtectedRoute 적용

백엔드에서 로그인 사용자 식별은 authentication.getName() 사용
