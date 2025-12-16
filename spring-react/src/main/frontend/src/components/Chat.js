import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import api from "../api/api";
import "./Chat.css";

/* JWT에서 loginId 추출 */
function getLoginIdFromToken() {
    const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.sub;
    } catch (e) {
        console.error("JWT 파싱 실패", e);
        return null;
    }
}

function Chat() {
    const navigate = useNavigate();
    const socketRef = useRef(null);

    const CURRENT_USER_ID = getLoginIdFromToken();

    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [roomMessages, setRoomMessages] = useState({});
    const [input, setInput] = useState("");

    /* 로그인 안 돼 있으면 차단 */
    useEffect(() => {
        if (!CURRENT_USER_ID) {
            alert("로그인이 필요합니다.");
            navigate("/auth/login");
        }
    }, [CURRENT_USER_ID, navigate]);

    /* 채팅방 목록 */
    useEffect(() => {
        if (!CURRENT_USER_ID) return;

        api.get("/chat/rooms", {
            params: { loginId: CURRENT_USER_ID },
        }).then((res) => {
            setRooms(res.data);
            if (res.data.length > 0) {
                setSelectedRoomId(res.data[0].roomId);
            }
        });
    }, [CURRENT_USER_ID]);

    const selectedRoom = useMemo(
        () => rooms.find((r) => r.roomId === selectedRoomId),
        [rooms, selectedRoomId]
    );

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
            });
    }, [selectedRoomId]);

    /* WebSocket */
    useEffect(() => {
        if (!selectedRoomId) return;

        const socket = new SockJS(`/api/chat?room=${selectedRoomId}`);
        socketRef.current = socket;

        socket.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            setRoomMessages((prev) => ({
                ...prev,
                [selectedRoomId]: [
                    ...(prev[selectedRoomId] || []),
                    msg,
                ],
            }));
        };

        return () => socket.close();
    }, [selectedRoomId]);

    const handleSend = () => {
        if (!input.trim()) return;

        api.post(`/chat/rooms/${selectedRoomId}/messages`, {
            senderId: CURRENT_USER_ID,
            content: input,
        });

        setInput("");
    };

    const messages = roomMessages[selectedRoomId] || [];

    return (
        <div className="page">
            <div className="chat-layout">
                <aside className="chat-list">
                    {rooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="chat-room"
                            onClick={() =>
                                setSelectedRoomId(room.roomId)
                            }
                        >
                            {room.otherUserName}
                        </div>
                    ))}
                </aside>

                <section className="chat-room-detail">
                    {selectedRoom ? (
                        <>
                            <h3>{selectedRoom.otherUserName}</h3>

                            <div className="chat-messages">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.messageId}
                                        className={
                                            msg.senderId ===
                                            CURRENT_USER_ID
                                                ? "me"
                                                : "other"
                                        }
                                    >
                                        {msg.content}
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
                                />
                                <button onClick={handleSend}>전송</button>
                            </div>
                        </>
                    ) : (
                        <p>채팅방을 선택하세요</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Chat;
