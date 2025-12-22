//Chat.js
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import "./Chat.css";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

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

function formatChatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    if (isToday) {
        return `${hh}:${min}`;
    }

    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

function Chat() {
    const navigate = useNavigate();
    const location = useLocation();

    const loginId = getLoginIdFromToken();
    const token = getToken();

    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState("전체");
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [roomMessages, setRoomMessages] = useState({});
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const [userId, setUserId] = useState(null);

    const stompRef = useRef(null);
    const subscriptionRef = useRef(null);

    useEffect(() => {
        if (!token || !loginId) {
            alert("로그인 후 이용 가능합니다.");
            navigate("/auth/login", { replace: true });
        }
    }, [token, loginId, navigate]);

    useEffect(() => {
        if (!token) return;

        api.get("/users/me")
            .then(res => {
                setUserId(res.data.userId);
            })
            .catch(err => {
                console.error(err);
            });
    }, [token]);

    useEffect(() => {
        if (!userId) return;

        setRooms([]);
        setRoomMessages({});
        setSelectedRoomId(null);
        setConnected(false);

        try {
            subscriptionRef.current?.unsubscribe();
            stompRef.current?.deactivate();
        } catch {}

        subscriptionRef.current = null;
        stompRef.current = null;
    }, [userId]);

    useEffect(() => {
        if (!loginId) return;

        const initChat = async () => {
            try {
                const res = await api.get("/chat/rooms");
                const currentRooms = res.data;
                setRooms(currentRooms);

                if (location.state?.bookId) {
                    const { bookId, sellerId } = location.state;

                    const existingRoom = currentRooms.find(
                        (r) =>
                            Number(r.bookId) === Number(bookId) &&
                            Number(r.sellerId) === Number(sellerId)
                    );

                    if (existingRoom) {
                        setSelectedRoomId(existingRoom.roomId);
                    } else {
                        const createRes = await api.post("/chat/rooms", {
                            bookId,
                            sellerId,
                        });
                        const newRoom = createRes.data;
                        setRooms((prev) => [newRoom, ...prev]);
                        setSelectedRoomId(newRoom.roomId);
                    }

                    navigate(location.pathname, { replace: true, state: {} });
                }
            } catch (err) {
                console.error(err);
            }
        };

        initChat();
    }, [loginId, location.state, navigate, userId]);

    const selectedRoom = useMemo(
        () => rooms.find((r) => r.roomId === selectedRoomId),
        [rooms, selectedRoomId]
    );

    const filteredRooms = useMemo(() => {
        const roomsWithMessage = rooms.filter(
            (r) => r.lastMessage !== null
        );

        if (filter === "전체") return roomsWithMessage;

        return roomsWithMessage.filter((r) =>
            filter === "판매"
                ? Number(r.sellerId) === Number(userId)
                : Number(r.buyerId) === Number(userId)
        );
    }, [filter, rooms, userId]);

    useEffect(() => {
        if (!selectedRoomId) return;

        const fetchMessages = async () => {
            try {
                const res = await api.get(
                    `/chat/rooms/${selectedRoomId}/messages`
                );
                setRoomMessages((prev) => ({
                    ...prev,
                    [selectedRoomId]: res.data,
                }));
            } catch (e) {
                console.error(e);
                setRoomMessages((prev) => ({
                    ...prev,
                    [selectedRoomId]: [],
                }));
                alert("해당 채팅방에 접근 권한이 없습니다.");
            }
        };

        fetchMessages();
    }, [selectedRoomId]);

    useEffect(() => {
        if (!token || stompRef.current) return;

        const client = new Client({
            webSocketFactory: () => new SockJS("/api/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 3000,
            debug: () => {},
        });

        client.onConnect = () => {
            stompRef.current = client;
            setConnected(true);
        };

        client.activate();
    }, [token]);

    useEffect(() => {
        if (!connected || !stompRef.current || !selectedRoomId) return;

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = stompRef.current.subscribe(
            `/topic/chat/rooms/${selectedRoomId}`,
            (message) => {
                const payload = JSON.parse(message.body);
                setRoomMessages((prev) => {
                    const prevList = prev[selectedRoomId] ?? [];
                    return {
                        ...prev,
                        [selectedRoomId]: [...prevList, payload],
                    };
                });
            }
        );

        return () => {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;
        };
    }, [connected, selectedRoomId]);

    useEffect(() => {
        return () => {
            try {
                subscriptionRef.current?.unsubscribe();
                stompRef.current?.deactivate();
            } catch {}
            subscriptionRef.current = null;
            stompRef.current = null;
        };
    }, []);

    const handleSend = () => {
        if (
            !input.trim() ||
            !selectedRoomId ||
            !stompRef.current ||
            !stompRef.current.connected
        ) {
            return;
        }

        stompRef.current.publish({
            destination: `/app/chat/rooms/${selectedRoomId}/messages`,
            body: JSON.stringify({ content: input }),
        });

        setInput("");
    };

    const messages = roomMessages[selectedRoomId] ?? [];

    const getOpponentId = (room) =>
        Number(room.sellerId) === Number(userId)
            ? room.buyerLoginId
            : room.sellerLoginId;



    return (
        <div className="page">
            <div className="container">
                <div className="chat-layout">
                    <aside className="chat-list">
                        <div className="chat-list-header">
                            <div className="chat-header-top">
                                <button
                                    className="back-btn"
                                    onClick={() => navigate(-1)}
                                >
                                    〈
                                </button>
                                <h2>대화방</h2>
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
                                        selectedRoomId === room.roomId ? "active" : ""
                                    }`}
                                    onClick={() => setSelectedRoomId(room.roomId)}
                                >
                                    <div className="profile-circle" />
                                    <div className="chat-room-info">
                                        <p className="nickname">
                                            {getOpponentId(room)}
                                        </p>
                                        <p className="last-message">
                                            {room.lastMessage}
                                        </p>
                                    </div>
                                    <div className="chat-room-meta">
                                        <span className="time">{room.lastTime}</span>
                                        <div className="product-thumb">
                                            <img
                                                src={
                                                    room.imageUrl
                                                        ? `http://localhost:8080${room.imageUrl}`
                                                        : "/book.webp"
                                                }
                                                alt={room.bookTitle}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <section className="chat-room-detail">
                        {!selectedRoom && (
                            <div className="chat-empty">
                                <h3>채팅을 시작해 보세요</h3>
                                <p>거래를 시작하면 채팅방이 생성됩니다.</p>
                            </div>
                        )}

                        {selectedRoom && (
                            <>
                                <div className="chat-header">
                                    <span className="chat-title">
                                        {getOpponentId(selectedRoom)}
                                    </span>
                                </div>

                                <div className="chat-product">
                                    <div className="product-image">
                                        <img
                                            src={
                                                selectedRoom.imageUrl
                                                    ? `http://localhost:8080${selectedRoom.imageUrl}`
                                                    : "/book.webp"
                                            }
                                            alt={selectedRoom.bookTitle}
                                        />
                                    </div>
                                    <div className="product-info">
                                        <span className="product-status">
                                            {selectedRoom.productStatus}
                                        </span>
                                        <span className="product-name">
                                            {selectedRoom.bookTitle}
                                        </span>
                                        <p className="product-price">
                                            {selectedRoom.price}원
                                        </p>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {messages.length === 0 && (
                                        <div className="no-message">
                                            아직 메시지가 없습니다.
                                        </div>
                                    )}

                                    {messages.map((msg, idx) => (
                                        <div
                                            key={msg.messageId || idx}
                                            className={`message ${
                                                msg.senderLoginId === loginId ? "me" : "other"
                                            }`}
                                        >
                                            <p>{msg.content}</p>
                                            <span className="msg-time">
                                                {formatChatTime(msg.sentAt)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="chat-input">
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
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


