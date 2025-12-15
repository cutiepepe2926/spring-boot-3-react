// src/pages/LoginPage.js
import React, { useState } from "react";
import axios from "axios";

function LoginPage() {
    const [form, setForm] = useState({
        id: "",
        pw: "",
        remember: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: 실제 로그인 API 연동
        const payload = {
            loginId: form.id,
            pw: form.pw
        }

        try {
            const res = await axios.post("/api/auth/v1/login", payload);

            const accessToken = res.data?.accessToken;
            if (!accessToken) throw new Error("토큰이 응답에 없습니다.");

            // Access만 쓰는 상태: 일단 저장(추후 remember에 따라 분기 가능)
            if (form.remember) localStorage.setItem("accessToken", accessToken);
            else sessionStorage.setItem("accessToken", accessToken);

            alert("로그인 성공!");
            window.location.href = "/";

            //나중에 추가처리필요

        } catch (e) {
            const msg = e.response?.data ?? "로그인 실패";
            alert(msg);
        }
    };

    return (
        <section className="auth-layout">
            {/* 왼쪽 책 이미지 영역 */}
            <div className="auth-hero">
                <div className="auth-hero-overlay">
                    <p className="hero-subtitle">함께 읽고 나누는 시간</p>
                    <h1 className="hero-title">
                        오늘도 한 권의 책으로
                        <br />
                        누군가에게 온기를 건네세요.
                    </h1>
                </div>
            </div>

            {/* 오른쪽 폼 영역 */}
            <div className="auth-panel">
                <h2 className="auth-title">로그인</h2>
                <p className="auth-description">
                    중고 도서 나눔과 거래를 위해
                    <br />
                    책의 온도 계정으로 로그인해주세요.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="login-id">아이디</label>
                        <input
                            id="login-id"
                            name="id"
                            type="text"
                            placeholder="아이디"
                            required
                            value={form.id}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="login-password">비밀번호</label>
                        <input
                            id="login-pw"
                            name="pw"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            required
                            value={form.pw}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-extra-row">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={form.remember}
                                onChange={handleChange}
                            />
                            <span>로그인 상태 유지</span>
                        </label>
                    </div>

                    <button type="submit" className="auth-button">
                        로그인
                    </button>
                </form>

                <p className="auth-meta">
                    아직 계정이 없으신가요?
                    <a href="/signup" className="link-main">
                        회원가입하기
                    </a>
                </p>
            </div>
        </section>
    );
}

export default LoginPage;
