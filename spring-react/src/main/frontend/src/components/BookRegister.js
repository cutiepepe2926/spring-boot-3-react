import "./BookRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";


function BookRegister() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");


    const handleSubmit = async () => {
        try {
            await api.post("/books", {
                title: title,
                price: price,
                description: description
            });

            alert("도서가 성공적으로 등록되었습니다!");
            navigate("/"); // 메인으로 이동
        } catch (e) {
            alert("등록 실패");
            console.error(e);
        }
    };


  return (
    <div className="register-container">
      <div className="form-grid">
        <div className="image-box">📷</div>

        <div className="form-area">
            <input
                type="text"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
          <input type="text" placeholder="작가명을 입력해주세요." />
          <input type="text" placeholder="출판사를 입력해주세요." />
            <input
                type="text"
                placeholder="가격을 입력해주세요."
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
                placeholder="도서 정보를 입력해주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />


        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}

export default BookRegister;
