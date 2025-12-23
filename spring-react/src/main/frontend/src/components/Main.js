import "./Main.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import BookDetail from "./BookDetail";

function Main() {
    const navigate = useNavigate();

    const [loginId, setLoginId] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]);

    const [searchInput, setSearchInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        api.get("/me")
            .then(res => setLoginId(res.data.loginId))
            .catch(() => {
                localStorage.removeItem("accessToken");
                sessionStorage.removeItem("accessToken");
                setLoginId(null);
            });
    }, []);

    useEffect(() => {
        api.get("/books/main")
            .then(res => {
                setBooks(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        setLoginId(null);
        navigate("/auth/login");
    };

    const openModal = (book) => {
        setSelectedBook(book);
    };

    const closeModal = () => {
        setSelectedBook(null);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const bookList = [...filteredBooks].sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
    );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBooks = bookList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(bookList.length / ITEMS_PER_PAGE);

    return (
        <div className="page">

            <div className="header-top">
                <div className="logo" style={{ color: "#00FF00" }}>책의 온도</div>
                <div className="header-buttons">
                    <button className="header-btn" onClick={() => navigate("/chat")}>
                        채팅방
                    </button>
                    {loginId ? (
                        <>
                            <div style={{ color: "#00FF00" }}>{loginId}님</div>
                            <button className="header-btn" onClick={handleLogout}>로그아웃</button>
                        </>
                    ) : (
                        <>
                            <button className="header-btn" onClick={() => navigate("/auth/login")}>로그인</button>
                            <button className="header-btn signup" onClick={() => navigate("/auth/register")}>회원가입</button>
                        </>
                    )}
                </div>
            </div>
            <div className="container">
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
                            <input
                                className="search-input"
                                placeholder="검색"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button
                                className="search-btn"
                                onClick={() => {
                                    setSearchKeyword(searchInput);
                                    setCurrentPage(1);
                                }}
                            >
                                검색
                            </button>
                            <button
                                className="register-btn"
                                onClick={() => {
                                    if (!loginId) {
                                        alert("로그인 후 이용 가능합니다.");
                                        navigate("/auth/login");
                                        return;
                                    }
                                    navigate("/register");
                                }}
                            >
                                등록하기
                            </button>

                        </div>
                    </div>

                    <div className="book-list">
                        {currentBooks.map((book) => (
                            <div
                                className="book-card"
                                key={book.bookId}
                                onClick={() => openModal(book)}
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    className="book-image"
                                    src={
                                        book.imageUrl
                                            ? `http://localhost:8080${book.imageUrl}`
                                            : "/book.webp"
                                    }
                                    alt={book.title}
                                />

                                <div className="book-info">
                                    <p className="book-title">{book.title}</p>
                                    <div className="book-meta">
                                        <span className="book-price">{book.price}원</span>
                                        <span className="book-date">
                      {new Date(book.createAt).toLocaleDateString()}
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedBook && <BookDetail book={selectedBook} onClose={closeModal} />}

                    <div className="pagination">
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                        >
                            {`<<`}
                        </button>
                        <button
                            className="page-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            {`<`}
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`page-number ${currentPage === page ? "active" : ""}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            {`>`}
                        </button>
                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                        >
                            {`>>`}
                        </button>
                    </div>

                </section>

            </div>
        </div>
    );
}

export default Main;