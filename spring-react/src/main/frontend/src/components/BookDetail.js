// BookDetail.jsx
import "./BookDetail.css";

function BookDetail({ book, onClose }) {
  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="detail-box">
            <div className="book-img">
              <img src="/book.webp" alt={book.title} />
            </div>
            <div className="book-info">
              <h2>{book.title}</h2>
              <div className="meta">
                저자 : {book.author || "미상"}<br />
                출판사 : {book.publisher || "미상"}<br />
                출간일 : {book.date}
              </div>
              <div className="price">{book.price}</div>
              <div className="divider"></div>
              <h4>도서 정보</h4>
              <p>{book.description || "상세 정보 없음"}</p>
              <div className="btn-box">
                <button className="btn btn-talk">구매하기</button>
              </div>
              <button className="modal-close" onClick={onClose}>닫기</button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default BookDetail;
