import "./BookDetail.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

function BookDetail({ book, onClose }) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    // 로그인 사용자 userId 조회
    useEffect(() => {
        const token =
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken");

        if (!token) return;

        api.get("/api/me")
            .then(res => {
                setUserId(res.data.userId);
            })
            .catch(() => {});
    }, []);

    // 🔹 로그인 유저가 판매자인지 여부
    const isSeller = userId && Number(userId) === Number(book.sellerId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="detail-box">
                    <div className="book-img">
                        <img
                            src={
                                book.imageUrl
                                    ? `http://localhost:8080${book.imageUrl}`
                                    : "/book.webp"
                            }
                            alt={book.title}
                        />
                    </div>

                    <div className="book-info">
                        <h2>{book.title}</h2>

                        <div className="meta">
                            저자 : {book.author || "미상"}<br />
                            출판사 : {book.publisher || "미상"}<br />
                        </div>

                        <div className="price">{book.price}원</div>

                        <div className="divider"></div>

                        <h4>도서 정보</h4>
                        <p>{book.description || "상세 정보 없음"}</p>

                        <div className="btn-box">
                            <button
                                className="btn btn-talk"
                                onClick={async () => {
                                    try {
                                        await api.post("/chat/rooms", {
                                            bookId: book.bookId,
                                        });

                                        navigate("/chat", {
                                            state: {
                                                bookId: book.bookId,
                                                sellerId: book.sellerId,
                                            },
                                        });
                                    } catch (err) {
                                        const message =
                                            err.response?.data?.message ||
                                            "본인이 판매 중인 상품은 구매할 수 없습니다.";

                                        alert(message);
                                    }
                                }}
                            >
                                구매하기
                            </button>
                        </div>

                        <button className="modal-close" onClick={onClose}>
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetail;