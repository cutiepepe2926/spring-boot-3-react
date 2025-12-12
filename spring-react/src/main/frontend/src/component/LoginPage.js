// src/pages/LoginPage.js
import React, { useState } from "react";

function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: 실제 로그인 API 연동
        console.log("로그인 요청 데이터:", form);
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
                        <label htmlFor="login-email">이메일</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="example@bookwarm.com"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="login-password">비밀번호</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            required
                            value={form.password}
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
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    className="link-small"*/}
                        {/*    style={{ border: "none", background: "none", padding: 0 }}*/}
                        {/*>*/}
                        {/*    비밀번호 찾기*/}
                        {/*</button>*/}
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
