import "./BookRegister.css";

function BookRegister() {
  const handleSubmit = () => {
    alert("도서가 성공적으로 등록되었습니다!");
  };

  return (
    <div className="register-container">
      <div className="form-grid">
        <div className="image-box">📷</div>

        <div className="form-area">
          <input type="text" placeholder="제목을 입력해주세요." />
          <input type="text" placeholder="작가명을 입력해주세요." />
          <input type="text" placeholder="출판사를 입력해주세요." />
          <input type="number" placeholder="가격을 입력해주세요." />
          <textarea placeholder="도서 정보를 입력해주세요." />
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        등록하기
      </button>
    </div>
  );
}

export default BookRegister;
