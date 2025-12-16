import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Main from "./components/Main";
import Chat from "./components/Chat";
import BookDetail from "./components/BookDetail";
import BookRegister from "./components/BookRegister";


import AuthLayout from "./components/AuthLayout"; // 새로 만들 파일

function App() {
    return (
            <Routes>
                {/* 기존 */}
                <Route path="/" element={<Main />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/detail/:id" element={<BookDetail />} />
                <Route path="/register" element={<BookRegister />} />

                {/* Auth 영역: /auth/* 아래로 묶음 */}
                <Route path="/auth/*" element={<AuthLayout />} />
            
            </Routes>
    );
}

export default App;
