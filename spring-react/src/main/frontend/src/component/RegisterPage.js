// src/pages/SignupPage.js
import React, { useState } from "react";
import axios from "axios";

function SignupPage() {
    const [form, setForm] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        passwordCheck: "",
        phone: "",
        agree: false,
    });

    // 정규식
    const ID_REGEX = /^[A-Za-z0-9]{4,20}$/;            // 아이디: 4~20자(영문/숫자)
    const NAME_REGEX = /^[가-힣]+$/;                    // 이름: 한글만
    const PHONE_REGEX = /^010-\d{4}-\d{4}$/;           // 전화번호: 010-0000-0000

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // 전화번호는 숫자만 입력되게 + 자동 하이픈 적용
        if (name === "phone") {
            const digits = value.replace(/\D/g, "").slice(0, 11); // 010xxxxxxxx (11자리)
            let formatted = digits;

            if (digits.length <= 3) {
                formatted = digits;
            } else if (digits.length <= 7) {
                formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else {
                formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
            }

            setForm((prev) => ({ ...prev, phone: formatted }));
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 아이디 길이(4~20) + 형식
        if (!ID_REGEX.test(form.id)) {
            alert("아이디는 4~20자, 영문/숫자만 가능합니다.");
            return;
        }

        // 이름 한글만
        if (!NAME_REGEX.test(form.name)) {
            alert("이름은 한글만 입력 가능합니다.");
            return;
        }

        // 비밀번호 길이 8~25
        if (form.password.length < 8 || form.password.length > 25) {
            alert("비밀번호는 8자 이상 25자 이하로 입력해주세요.");
            return;
        }

        if (form.password !== form.passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 전화번호 형식
        if (!PHONE_REGEX.test(form.phone)) {
            alert("전화번호는 010-0000-0000 형식으로 입력해주세요.");
            return;
        }

        if (!form.agree) {
            alert("약관에 동의해야 가입할 수 있습니다.");
            return;
        }
        // 회원가입 API 연동
        const payload = {
            loginId: form.id,
            user_name: form.name,
            email: form.email,
            pw: form.password,
            phone: form.phone
        };

        try {
            await axios.post("/api/auth/v1/register", payload);
            alert("회원가입 성공!");
            window.location.href = "/login";
        } catch (e) {
            const msg = e.response?.data ?? "회원가입 실패";
            alert(msg);
        }
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
                        <label htmlFor="signup-id">아이디</label>
                        <input
                            id="signup-id"
                            name="id"
                            type="text"
                            placeholder="아이디는 4글자 이상 입력해주세요."
                            required
                            value={form.id}
                            onChange={handleChange}
                        />
                    </div>

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

                    <div className="form-field">
                        <label htmlFor="signup-phone">전화번호</label>
                        <input
                            id="signup-phone"
                            name="phone"
                            type="text"
                            placeholder="010-xxxx-xxxx로 입력해주세요"
                            required
                            value={form.phone}
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
