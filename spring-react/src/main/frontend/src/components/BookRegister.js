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
    const [previewUrl, setPreviewUrl] = useState(null);
    const [author, setAuthor] = useState("");
    const [publisher, setPublisher] = useState("");





    const handleSubmit = async () => {
        if (!imageFile) {
            alert("이미지를 선택해주세요");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("price", Number(price));
            formData.append("description", description);
            formData.append("image", imageFile); // 📷 선택한 파일
            formData.append("author", author);
            formData.append("publisher", publisher);

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
                    <label htmlFor="imageUpload" className="image-label">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                className="preview-image"
                            />
                        ) : (
                            <span>📷 사진 등록</span>
                        )}
                    </label>

                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImageFile(file);

                            if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setPreviewUrl(imageUrl);
                            }
                        }}

                    />
                </div>


                <div className="form-area">
                    <input
                        type="text"
                        placeholder="제목을 입력해주세요."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="작가명을 입력해주세요."
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="출판사를 입력해주세요."
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                    />

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