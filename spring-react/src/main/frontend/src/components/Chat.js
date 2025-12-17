import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import api from "../api/api";
import "./Chat.css";

function getToken() {
    return (
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken")
    );
}

function getLoginIdFromToken() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub;
    } catch {
        return null;
    }
}

function Chat() {
    const navigate = useNavigate();
    const socketRef = useRef(null);

    const loginId = getLoginIdFromToken();
    const token = getToken();

    console.log("Chat Render - Token:", token ? "Exists" : "Null");
    console.log("Chat Render - LoginId:", loginId);

    useEffect(() => {
        // 기존: if (!token) { navigate("/auth/login"); }
        // 수정: 토큰이 없거나, 토큰은 있지만 유효하지 않아 loginId를 얻지 못한 경우
        if (!token || !loginId) {
            navigate("/auth/login");
        }
    }, [token, loginId, navigate]);

    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState("전체");
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [roomMessages, setRoomMessages] = useState({});
    const [input, setInput] = useState("");

    /* 채팅방 목록 */
    useEffect(() => {
        if (!loginId) return;

        api
            .get("/chat/rooms", {
                params: { userId: loginId },
            })
            .then((res) => {
                setRooms(res.data);
                if (res.data.length > 0) {
                    setSelectedRoomId(res.data[0].roomId);
                }
            })
            .catch((err) => {
                console.log(
                    "chat rooms error",
                    err.response?.status,
                    err.response?.data
                );
            });
    }, [loginId]);

    const selectedRoom = useMemo(() => {
        return rooms.find((r) => r.roomId === selectedRoomId);
    }, [rooms, selectedRoomId]);

    const filteredRooms = useMemo(() => {
        if (filter === "전체") return rooms;
        return rooms.filter((r) => r.type === filter);
    }, [filter, rooms]);

    /* 메시지 조회 */
    useEffect(() => {
        if (!selectedRoomId) return;

        api
            .get(`/chat/rooms/${selectedRoomId}/messages`)
            .then((res) => {
                setRoomMessages((prev) => ({
                    ...prev,
                    [selectedRoomId]: res.data,
                }));
            })
            .catch((err) => {
                console.log(
                    "messages error",
                    err.response?.status,
                    err.response?.data
                );
            });
    }, [selectedRoomId]);

    /* WebSocket 연결 */
    useEffect(() => {
        if (!selectedRoomId) return;

        const socket = new SockJS(
            `/api/chat?room=${selectedRoomId}&token=${token}`
        );
        socketRef.current = socket;

        socket.onmessage = (e) => {
            const payload = JSON.parse(e.data);
            setRoomMessages((prev) => {
                const prevMsgs = prev[selectedRoomId] ?? [];
                return {
                    ...prev,
                    [selectedRoomId]: [...prevMsgs, payload],
                };
            });
        };

        socket.onerror = (e) => {
            console.log("socket error", e);
        };

        return () => {
            socket.close();
            socketRef.current = null;
        };
    }, [selectedRoomId, token]);

    /* 메시지 전송 */
    const handleSend = () => {
        const text = input.trim();
        if (!text || !selectedRoomId) return;

        api
            .post(`/chat/rooms/${selectedRoomId}/messages`, {
                content: text,
            })
            .catch((err) => {
                console.log(
                    "send message error",
                    err.response?.status,
                    err.response?.data
                );
            });

        setInput("");
    };

    const messages = roomMessages[selectedRoomId] ?? [];

    return (
        <div className="page">
            <div className="container">
                <div className="chat-layout">
                    {/* 왼쪽 */}
                    <aside className="chat-list">
                        <div className="chat-list-header">
                            <button
                                className="back-btn"
                                onClick={() => navigate(-1)}
                            >
                                〈
                            </button>
                            <h2>대화방</h2>

                            <div className="chat-filters">
                                {["전체", "판매", "구매"].map((t) => (
                                    <button
                                        key={t}
                                        className={`filter-btn ${
                                            filter === t ? "active" : ""
                                        }`}
                                        onClick={() => setFilter(t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="chat-room-list">
                            {filteredRooms.length === 0 && (
                                <div className="chat-room-empty">
                                    채팅방이 없습니다.
                                </div>
                            )}

                            {filteredRooms.map((room) => (
                                <div
                                    key={room.roomId}
                                    className={`chat-room ${
                                        selectedRoomId === room.roomId
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedRoomId(room.roomId)
                                    }
                                >
                                    <div className="profile-circle" />

                                    <div className="chat-room-info">
                                        <p className="nickname">
                                            {room.otherUserName}
                                        </p>
                                        <p className="last-message">
                                            {room.lastMessage}
                                        </p>
                                    </div>

                                    <div className="chat-room-meta">
                                        <span className="time">
                                            {room.lastTime}
                                        </span>
                                        <div className="product-thumb">
                                            상품
                                            <br />
                                            사진
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* 오른쪽 */}
                    <section className="chat-room-detail">
                        {!selectedRoom && (
                            <div className="chat-empty">
                                <h3>채팅을 시작해 보세요</h3>
                                <p>
                                    거래를 시작하면 채팅방이 생성됩니다.
                                </p>
                            </div>
                        )}

                        {selectedRoom && (
                            <>
                                <header className="chat-header">
                                    <span className="chat-title">
                                        {selectedRoom.otherUserName}
                                    </span>
                                </header>

                                <div className="chat-product">
                                    <div className="product-image">
                                        상품
                                        <br />
                                        사진
                                    </div>

                                    <div className="product-info">
                                        <span className="product-status">
                                            {selectedRoom.productStatus}
                                        </span>
                                        <span className="product-name">
                                            {selectedRoom.productName}
                                        </span>
                                        <p className="product-price">
                                            {selectedRoom.productPrice}원
                                        </p>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {messages.length === 0 && (
                                        <div className="no-message">
                                            아직 메시지가 없습니다.
                                        </div>
                                    )}

                                    {messages.map((msg) => (
                                        <div
                                            key={msg.messageId}
                                            className={`message ${
                                                msg.senderId === loginId
                                                    ? "me"
                                                    : "other"
                                            }`}
                                        >
                                            <p>{msg.content}</p>
                                            <span className="msg-time">
                                                {msg.sentAt}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="chat-input">
                                    <input
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleSend()
                                        }
                                        placeholder="메시지를 입력하세요"
                                    />
                                    <button onClick={handleSend}>➤</button>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Chat;