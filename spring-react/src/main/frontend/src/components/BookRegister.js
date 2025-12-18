import "./BookRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";


function BookRegister() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);



    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("price", Number(price));
            formData.append("description", description);
            formData.append("image", imageFile); // 📷 선택한 파일

            await api.post("/books", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("도서가 성공적으로 등록되었습니다!");
            navigate("/");
        } catch (e) {
            alert("등록 실패");
            console.error(e);
        }
    };



  return (
    <div className="register-container">
      <div className="form-grid">
          <div className="image-box">
              <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                  {imageFile ? imageFile.name : "📷 사진 등록"}
              </label>
              <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setImageFile(e.target.files[0])}
              />
          </div>


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
