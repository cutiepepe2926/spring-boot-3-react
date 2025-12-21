// BookDetail.jsx
import "./BookDetail.css";
import { useNavigate } from "react-router-dom";

function BookDetail({ book, onClose }) {

    const navigate = useNavigate();


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
                        <div className="price">{book.price}</div>
                        <div className="divider"></div>
                        <h4>도서 정보</h4>
                        <p>{book.description || "상세 정보 없음"}</p>

                        <div className="btn-box">
                            <button
                                className="btn btn-talk"
                                onClick={() => {
                                    navigate("/chat", {
                                        state: {
                                            bookId: book.bookId,
                                            sellerId: book.sellerId,
                                        },
                                    });
                                }}
                            >
                                구매하기
                            </button>
                        </div>

                        <button className="modal-close" onClick={onClose}>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetail;
