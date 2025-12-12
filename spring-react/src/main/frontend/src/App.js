import React, {useEffect, useState} from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import AuthHeader from "./component/AuthHeader";
import LoginPage from "./component/LoginPage";
import RegisterPage from "./component/RegisterPage";
import axios from 'axios';
import "./style/auth.css"; // css 경로 주의!

function App() {
  const [hello, setHello] = useState('')

    // 1. body 클래스 세팅
    useEffect(() => {
        document.body.classList.add("auth-body");
        return () => {
            document.body.classList.remove("auth-body");
        };
    }, []);

    // 2. 백엔드에서 데이터 가져오기
    useEffect(() => {
        axios.get('/api/hello')
            .then(response => setHello(response.data))
            .catch(error => console.log(error));
    }, []);

  return (
      <>
          <AuthHeader />
          <main className="auth-main">
              <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<LoginPage/>} />
                  <Route path="/signup" element={<RegisterPage/>} />
              </Routes>
              {/*<div>*/}
              {/*    백엔드에서 가져온 데이터입니다 : {hello}*/}
              {/*</div>*/}
          </main>
      </>
  );
}

export default App;
