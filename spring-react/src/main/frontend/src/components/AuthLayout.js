import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthHeader from "../component/AuthHeader";
import LoginPage from "../component/LoginPage";
import RegisterPage from "../component/RegisterPage";

import "../style/auth.css";

function AuthLayout() {
    // body 클래스 적용 (auth 화면에서만)
    useEffect(() => {
        document.body.classList.add("auth-body");
        return () => document.body.classList.remove("auth-body");
    }, []);

    return (
        <>
            <AuthHeader />
            <main className="auth-main">
                <Routes>
                    {/* /auth 로 들어오면 /auth/login 으로 */}
                    <Route path="/" element={<Navigate to="login" replace />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<RegisterPage />} />
                </Routes>
            </main>
        </>
    );
}

export default AuthLayout;
