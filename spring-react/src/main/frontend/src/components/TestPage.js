// src/pages/TestPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function TestPage() {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const readToken = () => {
        return (
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken") ||
            ""
        );
    };

    const callApi = async () => {
        setLoading(true);
        setResult("");
        setError("");

        const t = readToken();
        setToken(t);

        if (!t) {
            setLoading(false);
            setError("저장된 accessToken이 없습니다. 먼저 로그인하세요.");
            return;
        }

        try {
            const res = await axios.get("/api/test", {
                headers: {
                    Authorization: `Bearer ${t}`,
                },
            });

            // 서버가 String을 반환하면 res.data는 문자열
            setResult(typeof res.data === "string" ? res.data : JSON.stringify(res.data));
        } catch (e) {
            const status = e.response?.status;
            const data = e.response?.data;

            setError(
                `요청 실패 (status: ${status ?? "unknown"})\n` +
                `response: ${typeof data === "string" ? data : JSON.stringify(data)}`
            );
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        setToken("");
        setResult("");
        setError("토큰을 삭제했습니다. 다시 로그인 후 테스트하세요.");
    };

    useEffect(() => {
        // 페이지 들어오자마자 한 번 호출하고 싶으면 주석 해제
        // callApi();
    }, []);

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
            <h2>JWT 테스트 페이지</h2>

            <p style={{ marginTop: 8 }}>
                <b>설명</b>: 저장된 accessToken을 읽어서 <code>/api/test</code>를 호출합니다.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button onClick={callApi} disabled={loading}>
                    {loading ? "호출 중..." : "/api/test 호출"}
                </button>

                <button onClick={logout} disabled={loading}>
                    토큰 삭제(로그아웃)
                </button>
            </div>

            <hr style={{ margin: "20px 0" }} />

            <div>
                <h3>현재 토큰</h3>
                <textarea
                    readOnly
                    value={token}
                    placeholder="(토큰 없음)"
                    style={{ width: "100%", height: 120, resize: "vertical" }}
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <h3>성공 결과</h3>
                <pre
                    style={{
                        background: "#f5f5f5",
                        padding: 12,
                        minHeight: 60,
                        whiteSpace: "pre-wrap",
                    }}
                >
          {result || "(아직 성공 결과 없음)"}
        </pre>
            </div>

            <div style={{ marginTop: 16 }}>
                <h3>에러</h3>
                <pre
                    style={{
                        background: "#fff3f3",
                        padding: 12,
                        minHeight: 60,
                        whiteSpace: "pre-wrap",
                    }}
                >
          {error || "(에러 없음)"}
        </pre>
            </div>
        </div>
    );
}

export default TestPage;
