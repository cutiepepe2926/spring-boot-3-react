// src/pages/SignupPage.js
import React, { useState } from "react";

function SignupPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        passwordCheck: "",
        agree: false,
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
        if (form.password !== form.passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!form.agree) {
            alert("약관에 동의해야 가입할 수 있습니다.");
            return;
        }
        // TODO: 실제 회원가입 API 연동
        console.log("회원가입 요청 데이터:", form);
    };

    return (
        <section className="auth-layout">
            {/* 왼쪽 책 이미지 영역 */}
            <div className="auth-hero">
                <div className="auth-hero-overlay">
                    <p className="hero-subtitle">책이 오가는 작은 도서관</p>
                    <h1 className="hero-title">
                        당신의 책장에서
                        <br />
                        다른 사람의 이야기까지.
                    </h1>
                </div>
            </div>

            {/* 오른쪽 폼 영역 */}
            <div className="auth-panel">
                <h2 className="auth-title">회원가입</h2>
                <p className="auth-description">
                    중고 도서를 올리고, 원하는 책을 찾아보세요.
                    <br />
                    몇 가지 정보만으로 간편하게 가입할 수 있어요.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="signup-name">이름</label>
                        <input
                            id="signup-name"
                            name="name"
                            type="text"
                            placeholder="이름을 입력하세요"
                            required
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="signup-email">이메일</label>
                        <input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="example@bookwarm.com"
                            required
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="signup-password">비밀번호</label>
                        <input
                            id="signup-password"
                            name="password"
                            type="password"
                            placeholder="8자 이상 입력하세요"
                            required
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="signup-password-check">비밀번호 확인</label>
                        <input
                            id="signup-password-check"
                            name="passwordCheck"
                            type="password"
                            placeholder="비밀번호를 한 번 더 입력하세요"
                            required
                            value={form.passwordCheck}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-extra-row">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                                required
                            />
                            <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
                        </label>
                    </div>

                    <button type="submit" className="auth-button">
                        회원가입 완료
                    </button>
                </form>

                <p className="auth-meta">
                    이미 책의 온도 회원이신가요?
                    <a href="/login" className="link-main">
                        로그인하기
                    </a>
                </p>
            </div>
        </section>
    );
}

export default SignupPage;
