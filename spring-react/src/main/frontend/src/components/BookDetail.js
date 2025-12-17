import "./BookDetail.css";
import { useNavigate, useParams } from "react-router-dom";

function BookDetail() {
    const navigate = useNavigate();
    const { id } = useParams(); // bookId

    return (
        <div className="page-wrap">
            <div className="container">
                <h3 style={{ fontSize: "20px", marginBottom: "25px" }}>
                    도서 상세 정보 - ID: {id}
                </h3>

                <div className="detail-box">
                    <div className="book-img">
                        <img src="/book.webp" alt="book" />
                    </div>

                    <div className="book-info">
                        <h2>건축너머 비평너머</h2>

                        <div className="meta">
                            저자 : 박영민<br />
                            출판사 : 안그라픽스<br />
                            출간일 : 2024년 01월 31일
                        </div>

                        <div className="price">8,000원</div>

                        <div className="divider" />

                        <h4>도서 정보</h4>
                        <p>
                            건축너머 비평너머 책입니다.
                            <br />
                            개인 의견이 포함돼 있을 수 있습니다.
                            <br />
                            하단 안내가 읽기 좋았습니다.
                        </p>

                        <div className="btn-box">
                            <button className="btn btn-save">찜하기</button>
                            <button
                                className="btn btn-talk"
                                onClick={() =>
                                    navigate("/chat", {
                                        state: {
                                            bookId: id,
                                            sellerId: 2, // 실제 판매자 ID
                                        },
                                    })
                                }
                            >
                                구매하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookDetail;
