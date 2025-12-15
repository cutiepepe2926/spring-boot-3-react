import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Main from "./components/Main";
import Chat from "./components/Chat";

import AuthLayout from "./components/AuthLayout"; // 새로 만들 파일

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 기존 */}
                <Route path="/" element={<Main />} />
                <Route path="/chat" element={<Chat />} />

                {/* Auth 영역: /auth/* 아래로 묶음 */}
                <Route path="/auth/*" element={<AuthLayout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
