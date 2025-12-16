import "./Main.css";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();

  //임시 데이터 (삭제 예정)
  const books = [
    { id: 1, title: "책1", price: "8,000원", date: "2025.12.12" },
    { id: 2, title: "책2", price: "8,000원", date: "2025.12.12" },
    { id: 3, title: "책3", price: "8,000원", date: "2025.12.11" },
    { id: 4, title: "책4", price: "8,000원", date: "2025.12.11" },
    { id: 5, title: "책5", price: "8,000원", date: "2025.12.10" },
    { id: 6, title: "책6", price: "8,000원", date: "2025.12.10" },
    { id: 7, title: "책7", price: "8,000원", date: "2025.12.09" },
    { id: 8, title: "책8", price: "8,000원", date: "2025.12.08" },
  ];

  const bookList = [...books].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="page">
      <div className="container">

        <header className="header">
          <div className="logo">책의 온도</div>
          <div className="header-buttons">
            <button className="header-btn" onClick={() => navigate("/chat")}>
              채팅방
            </button>
            <button className="header-btn" onClick={() => navigate("/auth/login")}>로그인</button>
            <button className="header-btn signup" onClick={() => navigate("/auth/register")}>회원가입</button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-overlay">
            <h1>함께 읽고 나누는 독서 활동</h1>
            <p>책과 사람을 연결합니다</p>
          </div>
        </section>

        <section className="content">
          <div className="content-header">
            <h2>중고 도서 목록</h2>
            <div className="search-box">
              <input className="search-input" placeholder="검색" />
              <button className="search-btn">검색</button>
            </div>
          </div>

        <div className="book-list">
          {bookList.map((book) => (
            <div
              className="book-card"
              key={book.id}
              onClick={() => navigate(`/detail/${book.id}`)}
              style={{ cursor: "pointer" }} // 클릭 가능 표시
            >
              <img className="book-image" alt="책 이미지" />
              <div className="book-info">
                <p className="book-title">{book.title}</p>
                <div className="book-meta">
                  <span className="book-price">{book.price}</span>
                  <span className="book-date">{book.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>


          <div className="pagination">
            <button className="page-btn">{`<<`}</button>
            <button className="page-btn">{`<`}</button>
            <button className="page-number active">1</button>
            <button className="page-number">2</button>
            <button className="page-number">3</button>
            <button className="page-number">4</button>
            <button className="page-number">5</button>
            <button className="page-btn">{`>`}</button>
            <button className="page-btn">{`>>`}</button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Main;
