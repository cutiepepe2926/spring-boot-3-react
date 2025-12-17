import "./Main.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

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

function Main() {
    const navigate = useNavigate();
    const loginId = getLoginIdFromToken();

    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const ITEMS_PER_PAGE = 8;

    const isLoggedIn = () => {
        return (
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("accessToken")
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        navigate("/");
    };

    const handleChatClick = () => {
        navigate("/chat");
    };

    const fetchBooks = async () => {
        try {
            const res = await api.get("/books/main");
            setBooks(res.data);
        } catch (err) {
            console.error("도서 목록 조회 실패", err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentBooks = filteredBooks.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

    return (
        <div className="page main-page">
            <div className="container">
                <header className="header">
                    <div className="header-inner">
                        <div className="logo" style={{ color: "#00FF00" }}>
                            책의 온도
                        </div>

                        <div className="header-right">
                            <button
                                className="header-btn"
                                onClick={handleChatClick}
                            >
                                채팅방
                            </button>

                            {isLoggedIn() && loginId ? (
                                <div className="login-info">
                                    <span className="welcome-text">
                                        {loginId}님 환영합니다
                                    </span>
                                    <button
                                        className="header-btn logout"
                                        onClick={handleLogout}
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        className="header-btn"
                                        onClick={() =>
                                            navigate("/auth/login")
                                        }
                                    >
                                        로그인
                                    </button>
                                    <button
                                        className="header-btn signup"
                                        onClick={() =>
                                            navigate("/auth/register")
                                        }
                                    >
                                        회원가입
                                    </button>
                                </>
                            )}
                        </div>
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
                            <input
                                className="search-input"
                                placeholder="검색"
                                value={searchInput}
                                onChange={(e) =>
                                    setSearchInput(e.target.value)
                                }
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
                        </div>
                    </div>

                    <div className="book-list">
                        {currentBooks.map((book) => (
                            <div
                                className="book-card"
                                key={book.bookId}
                                onClick={() =>
                                    navigate(`/detail/${book.bookId}`)
                                }
                            >
                                <img
                                    className="book-image"
                                    src={book.imageUrl}
                                    alt={book.title}
                                />
                                <div className="book-info">
                                    <p className="book-title">
                                        {book.title}
                                    </p>
                                    <div className="book-meta">
                                        <span className="book-price">
                                            {book.price.toLocaleString()}원
                                        </span>
                                        <span className="book-date">
                                            {book.createAt?.slice(0, 10)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

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
                            onClick={() =>
                                setCurrentPage((prev) => prev - 1)
                            }
                        >
                            {`<`}
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <button
                                key={page}
                                className={`page-number ${
                                    currentPage === page ? "active" : ""
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((prev) => prev + 1)
                            }
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
