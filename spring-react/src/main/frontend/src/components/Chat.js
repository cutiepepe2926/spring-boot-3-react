import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import "./Chat.css";

function getToken() {
    return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
}

function getLoginIdFromToken() {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub;
    } catch { return null; }
}

function Chat() {
    const navigate = useNavigate();
    const location = useLocation();
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const loginId = getLoginIdFromToken();
    const token = getToken();

    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState("전체");
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [roomMessages, setRoomMessages] = useState({});
    const [input, setInput] = useState("");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [roomMessages[selectedRoomId]]);

    useEffect(() => {
        if (!token || !loginId) {
            alert("로그인 후 이용 가능합니다.");
            navigate("/auth/login", { replace: true });
            return;
        }
    }, [token, loginId, navigate]);

    useEffect(() => {
        if (!loginId) return;
        const initChat = async () => {
            try {
                const res = await api.get(`/chat/rooms?userId=${loginId}`);
                const currentRooms = res.data;
                setRooms(currentRooms);

                const state = location.state;
                if (state && state.bookId) {
                    const targetBookId = Number(state.bookId);
                    const targetSellerId = Number(state.sellerId);
                    const myUserNo = 1;

                    const existingRoom = currentRooms.find(
                        (r) => Number(r.bookId) === targetBookId &&
                            (Number(r.sellerId) === targetSellerId && Number(r.buyerId) === myUserNo)
                    );

                    if (existingRoom) {
                        setSelectedRoomId(existingRoom.roomId);
                    } else {
                        const createRes = await api.post("/chat/rooms", {
                            bookId: targetBookId,
                            sellerId: targetSellerId,
                            buyerId: myUserNo,
                        });
                        if (createRes.data) {
                            const newRoom = createRes.data;
                            setRooms((prev) => prev.some(r => r.roomId === newRoom.roomId) ? prev : [newRoom, ...prev]);
                            setSelectedRoomId(newRoom.roomId);
                        }
                    }
                    navigate(location.pathname, { replace: true, state: null });
                }
            } catch (err) { console.error(err); }
        };
        initChat();
    }, [loginId, location.pathname]);

    useEffect(() => {
        if (!selectedRoomId) return;
        socketRef.current = new WebSocket(`ws://localhost:8080/chat/${selectedRoomId}`);
        socketRef.current.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);

            setRooms((prev) =>
                prev.map((r) =>
                    r.roomId === selectedRoomId
                        ? { ...r, lastMessage: newMessage.content, lastTime: newMessage.sentAt }
                        : r
                )
            );

            setRoomMessages((prev) => {
                const currentMsgs = prev[selectedRoomId] || [];
                const isDuplicate = currentMsgs.some(msg =>
                    msg.content === newMessage.content && msg.senderId === newMessage.senderId
                );
                if (isDuplicate) return prev;
                return {
                    ...prev,
                    [selectedRoomId]: [...currentMsgs, newMessage],
                };
            });
        };
        return () => { if (socketRef.current) socketRef.current.close(); };
    }, [selectedRoomId]);

    const selectedRoom = useMemo(() => rooms.find((r) => r.roomId === selectedRoomId), [rooms, selectedRoomId]);

    const filteredRooms = useMemo(() => {
        if (filter === "전체") return rooms;
        return rooms.filter((r) => {
            if (filter === "판매") return String(r.sellerId) === "1";
            if (filter === "구매") return String(r.buyerId) === "1";
            return true;
        });
    }, [filter, rooms]);

    useEffect(() => {
        if (!selectedRoomId) return;
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/chat/rooms/${selectedRoomId}/messages`);
                setRoomMessages((prev) => ({ ...prev, [selectedRoomId]: res.data }));
            } catch (err) { console.error(err); }
        };
        fetchMessages();
    }, [selectedRoomId]);

    const handleSend = async () => {
        if (!input.trim() || !selectedRoomId) return;
        try {
            const myUserNo = 1;
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageData = {
                senderId: myUserNo,
                content: input,
                sentAt: timeStr
            };

            await api.post(`/chat/rooms/${selectedRoomId}/messages`, messageData);

            setRooms((prev) =>
                prev.map((r) =>
                    r.roomId === selectedRoomId
                        ? { ...r, lastMessage: input, lastTime: timeStr }
                        : r
                )
            );

            setRoomMessages((prev) => ({
                ...prev,
                [selectedRoomId]: [...(prev[selectedRoomId] || []), messageData],
            }));

            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(messageData));
            }
            setInput("");
        } catch (err) { console.error(err); }
    };

    const messages = roomMessages[selectedRoomId] ?? [];

    return (
        <div className="page">
            <div className="container">
                <div className="chat-layout">
                    <aside className="chat-list">
                        <div className="chat-list-header">
                            <div className="chat-header-top">
                                <button className="back-btn" onClick={() => navigate(-1)}>〈</button>
                                <h2>대화방</h2>
                            </div>

                            <div className="chat-filters">
                                {["전체", "판매", "구매"].map((t) => (
                                    <button
                                        key={t}
                                        className={`filter-btn ${filter === t ? "active" : ""}`}
                                        onClick={() => setFilter(t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="chat-room-list">
                            {filteredRooms.length === 0 && <div className="chat-room-empty">채팅방이 없습니다.</div>}
                            {filteredRooms.map((room) => (
                                <div key={room.roomId} className={`chat-room ${selectedRoomId === room.roomId ? "active" : ""}`} onClick={() => setSelectedRoomId(room.roomId)}>
                                    <div className="profile-circle" />
                                    <div className="chat-room-info">
                                        <p className="nickname">{room.sellerId}</p>
                                        <p className="last-message">{room.lastMessage || "대화를 시작해 보세요."}</p>
                                    </div>
                                    <div className="chat-room-meta">
                                        <span className="time">{room.lastTime}</span>
                                        <div className="product-thumb">상품<br />사진</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                    <section className="chat-room-detail">
                        {!selectedRoom && <div className="chat-empty"><h3>채팅을 시작해 보세요</h3><p>거래를 시작하면 채팅방이 생성됩니다.</p></div>}
                        {selectedRoom && (
                            <>
                                <div className="chat-header"><div className="chat-title">{selectedRoom.sellerId}</div></div>
                                <div className="chat-product">
                                    <div className="product-image">상품<br />사진</div>
                                    <div className="product-info">
                                        <span className="product-status">{selectedRoom.productStatus}</span>
                                        <span className="product-name">{selectedRoom.productName}</span>
                                        <p className="product-price">{selectedRoom.productPrice?.toLocaleString()}원</p>
                                    </div>
                                </div>
                                <div className="chat-messages">
                                    {messages.length === 0 && <div className="no-message">아직 메시지가 없습니다.</div>}
                                    {messages.map((msg, idx) => (
                                        <div key={msg.messageId || idx} className={`message ${String(msg.senderId) === "1" ? "me" : "other"}`}>
                                            <p>{msg.content}</p>
                                            <span className="msg-time">{msg.sentAt}</span>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="chat-input">
                                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="메시지를 입력하세요" />
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