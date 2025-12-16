import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import AuthHeader from "../components/AuthHeader";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import TestPage from "../components/TestPage";
import api from "../api/api";

import "../style/auth.css";


function AuthLayout() {

    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    // body 클래스 적용 (auth 화면에서만)
    useEffect(() => {
        document.body.classList.add("auth-body");
        return () => document.body.classList.remove("auth-body");
    }, []);

    // auth  페이지 접근 시: 토큰 있으면 서버로 유효성 확인 후 리다이렉트
    // 정확히는 이미 로그인 된 사람이 로그인/회원가입 화면 (/auth 하위 주소)에 들어오지 못하게 막는 기능
    // 추가로 저장된 토큰이 서버에서 유효한지도 체크함.
    // 토큰이 만료되거나 임의로 수정 시, 서버로부터 적절한 토큰인지를 확인을 통해 진행
    // 이미 로그인되었으며, 적절한 토큰을 소유 시, /auth 주소는 차단하고 메인 페이지로 보냄
    useEffect(() => {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

        if (!token) {
            setChecking(false);
            return;
        }

        api.get("/me")
            .then(()=> {
                // 토큰이 유효한 경우, auth 페이지 못 들어오게 막고 메인 페이지로 리다이렉트
                navigate("/", { replace : true});
            })
            .catch(() => {
                // 토큰 무효 -> 삭제하고 auth 화면 유지
                localStorage.removeItem("accessToken");
                sessionStorage.removeItem("accessToken");
                setChecking(false);
            })
    }, [navigate]);

    // 로딩 UI
    if (checking) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <p style={{ fontSize: 18 }}>로딩 중...</p>
            </div>
        );
    }

    return (
        <>
            <AuthHeader />
            <main className="auth-main">
                <Routes>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="test" element={<TestPage />} />
                </Routes>
            </main>
        </>
    );
}

export default AuthLayout;
