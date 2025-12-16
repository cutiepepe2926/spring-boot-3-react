// src/components/Header.js
import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <header className="site-header">
            <div className="header-inner">
                <NavLink to="/" className="logo">
                    책의 온도
                </NavLink>
                <nav className="header-nav">
                    <NavLink
                        to="/auth/login"
                        className={({ isActive }) =>
                            "nav-link" + (isActive ? " nav-link--active" : "")
                        }>
                        로그인
                    </NavLink>
                    <span>|</span>
                    <NavLink
                        to="/auth/register"
                        className={({ isActive }) =>
                            "nav-link" + (isActive ? " nav-link--active" : "")
                        }
                    >
                        회원가입
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Header;
