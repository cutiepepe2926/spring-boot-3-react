import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.css";

function Chat() {
  const navigate = useNavigate();

  // 채팅방 임시 데이터 (삭제 예정)
  const rooms = [
    {
      id: 1,
      type: "구매",
      nickname: "닉네임A",
      productStatus: "예약중",
      productName: "품목 이름 A",
      productPrice: "8,000원",
      messages: [
        { id: 1, sender: "other", text: "안녕하세요 구매 가능할까요?", time: "11:50" },
        { id: 2, sender: "me", text: "네 가능합니다!", time: "11:52" },
      ],
    },
    {
      id: 2,
      type: "판매",
      nickname: "닉네임B",
      productStatus: "판매중",
      productName: "품목 이름 B",
      productPrice: "12,000원",
      messages: [
        { id: 1, sender: "other", text: "아직 판매 중인가요?", time: "12:01" },
        { id: 2, sender: "me", text: "네 판매 중입니다.", time: "12:03" },
      ],
    },
    {
      id: 3,
      type: "구매",
      nickname: "닉네임C",
      productStatus: "예약중",
      productName: "품목 이름 C",
      productPrice: "5,000원",
      messages: [
        { id: 1, sender: "other", text: "거래 가능 시간 언제인가요?", time: "09:15" },
      ],
    },
  ];

  // ===== 상태 =====
  const [filter, setFilter] = useState("전체");
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);

  const [roomMessages, setRoomMessages] = useState(() => {
    const init = {};
    rooms.forEach((r) => {
      init[r.id] = r.messages;
    });
    return init;
  });

  const [input, setInput] = useState("");

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId),
    [selectedRoomId]
  );

  const filteredRooms = useMemo(() => {
    if (filter === "전체") return rooms;
    return rooms.filter((r) => r.type === filter);
  }, [filter, rooms]);

  // ===== 채팅방 선택 =====
  const handleSelectRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setInput("");
  };

  // ===== 메시지 전송 =====
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const currentMsgs = roomMessages[selectedRoomId] ?? [];
    const newMsg = {
      id: currentMsgs.length + 1,
      sender: "me",
      text,
      time,
    };

    setRoomMessages((prev) => ({
      ...prev,
      [selectedRoomId]: [...prev[selectedRoomId], newMsg],
    }));

    setInput("");
  };

  const handleProductAction = (type) => {
    alert(`${type} 기능은 추후 연결`);
  };

  const messages = roomMessages[selectedRoomId] ?? [];

  return (
    <div className="page">
      <div className="container">
        <div className="chat-layout">
          {/* ===== 왼쪽: 대화방 목록 ===== */}
          <aside className="chat-list">
            <div className="chat-list-header">
              {/*  뒤로가기 버튼 */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  className="back-btn"
                  onClick={() => navigate(-1)}
                >
                〈
                </button>
                <h2>대화방</h2>
              </div>

              <div className="chat-filters">
                <button
                  className={`filter-btn ${filter === "전체" ? "active" : ""}`}
                  onClick={() => setFilter("전체")}
                >
                  전체
                </button>
                <button
                  className={`filter-btn ${filter === "판매" ? "active" : ""}`}
                  onClick={() => setFilter("판매")}
                >
                  판매
                </button>
                <button
                  className={`filter-btn ${filter === "구매" ? "active" : ""}`}
                  onClick={() => setFilter("구매")}
                >
                  구매
                </button>
              </div>
            </div>

            <div className="chat-room-list">
              {filteredRooms.map((room) => {
                const last =
                  (roomMessages[room.id] ?? room.messages).slice(-1)[0];
                return (
                  <div
                    key={room.id}
                    className={`chat-room ${
                      selectedRoomId === room.id ? "active" : ""
                    }`}
                    onClick={() => handleSelectRoom(room.id)}
                  >
                    <div className="profile-circle" />
                    <div className="chat-room-info">
                      <p className="nickname">{room.nickname}</p>
                      <p className="last-message">
                        {last ? last.text : "대화가 없습니다."}
                      </p>
                    </div>
                    <div className="chat-room-meta">
                      <span className="time">{last?.time}</span>
                      <div className="product-thumb">상품<br />사진</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ===== 오른쪽: 채팅 영역 ===== */}
          <section className="chat-room-detail">
            <header className="chat-header">
              <span className="chat-title">{selectedRoom?.nickname}</span>
            </header>

            <div className="chat-product">
              <div className="product-image">상품<br />사진</div>
              <div className="product-info">
                <div className="product-top">
                  <span className="product-status">
                    {selectedRoom?.productStatus}
                  </span>
                  <span className="product-name">
                    {selectedRoom?.productName}
                  </span>
                </div>
                <p className="product-price">
                  {selectedRoom?.productPrice}
                </p>
                <div className="product-actions">
                  <button onClick={() => handleProductAction("송금 요청")}>
                    송금 요청
                  </button>
                  <button onClick={() => handleProductAction("후기 작성")}>
                    후기 작성
                  </button>
                  <button onClick={() => handleProductAction("장소 공유")}>
                    장소 공유
                  </button>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <p>{msg.text}</p>
                  <span className="msg-time">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <button className="plus-btn">＋</button>
              <input
                type="text"
                placeholder="메시지를 입력하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="send-btn" onClick={handleSend}>
                ➤
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Chat;
