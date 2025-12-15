import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthHeader from "../components/AuthHeader";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";

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
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Routes>
            </main>
        </>
    );
}

export default AuthLayout;
