CREATE TABLE users (
    user_id     INT NOT NULL AUTO_INCREMENT COMMENT '회원 고유 ID',
    login_id    VARCHAR(255)  NOT NULL COMMENT '로그인 ID',             -- 고유값
    pw    VARCHAR(255) NOT NULL COMMENT '비밀번호(암호화 저장)',  -- 중복허용
    user_name        VARCHAR(50)  NOT NULL COMMENT '이름',                   -- 중복허용
    email       VARCHAR(100) NOT NULL COMMENT '이메일',                 -- 고유값
    phone       VARCHAR(20)  NOT NULL COMMENT '전화번호',               -- 고유값
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              COMMENT '가입일',                         -- 중복허용

    PRIMARY KEY (user_id),
    UNIQUE KEY uk_users_login_id (login_id),
    UNIQUE KEY uk_users_email    (email),
    UNIQUE KEY uk_users_phone    (phone)
);

SELECT * FROM USERS;
-- SET FOREIGN_KEY_CHECKS = 0;
-- drop table users;
-- SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE book (
    book_id      INT NOT NULL AUTO_INCREMENT COMMENT '상품 ID',
    seller_id    INT NOT NULL COMMENT '판매자 ID (users.user_id 참조)',
    title        VARCHAR(100) NOT NULL COMMENT '상품 대표 이름(책 제목)',
    seller_name  VARCHAR(50)  NOT NULL COMMENT '판매자 이름',
    price        INT          NOT NULL COMMENT '상품 가격',
    description  VARCHAR(255) NOT NULL COMMENT '상품 상세 설명',
    status       VARCHAR(20)  NOT NULL DEFAULT '판매중' CHECK(status IN ('판매중', '예약중', '판매완료')) COMMENT '판매 상태(판매중, 예약중, 판매완료 등)',
    create_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일자',

    PRIMARY KEY (book_id),

    -- 회원 테이블(users)의 user_id를 참조
    CONSTRAINT fk_book_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

ALTER TABLE book ADD COLUMN author VARCHAR(255);
ALTER TABLE book ADD COLUMN publisher VARCHAR(255);

CREATE TABLE book_image (
    image_id     VARCHAR(255) NOT NULL COMMENT '이미지 ID(고유값)',
    book_id      INT NOT NULL COMMENT '어떤 도서의 이미지인지 나타냄',
    image_url    VARCHAR(255) NOT NULL COMMENT '이미지 파일 경로/URL',
    is_thumbnail BOOLEAN      NOT NULL DEFAULT FALSE CHECK (is_thumbnail IN (0, 1)) COMMENT '대표 이미지인지 여부',
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                               COMMENT '이미지 등록 일자',

    PRIMARY KEY (image_id),

    CONSTRAINT fk_book_image_book
        FOREIGN KEY (book_id) REFERENCES book(book_id)
);


CREATE TABLE chat_room (
    room_id    INT NOT NULL AUTO_INCREMENT COMMENT '채팅방 고유 ID',
    book_id    INT NOT NULL COMMENT '상품 ID',
    seller_id  INT NOT NULL COMMENT '판매자 ID',
    buyer_id   INT NOT NULL COMMENT '구매를 문의한 사람 ID',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                           COMMENT '방 생성 시각',

    PRIMARY KEY (room_id),

    -- FK 설정
    CONSTRAINT fk_chat_room_book
        FOREIGN KEY (book_id)   REFERENCES book(book_id),
    CONSTRAINT fk_chat_room_seller
        FOREIGN KEY (seller_id) REFERENCES users(user_id),
    CONSTRAINT fk_chat_room_buyer
        FOREIGN KEY (buyer_id)  REFERENCES users(user_id)
);

ALTER TABLE chat_room
ADD COLUMN is_closed BOOLEAN DEFAULT FALSE;

CREATE TABLE chat_message (
    message_id INT NOT NULL AUTO_INCREMENT COMMENT '메시지 고유 ID',
    room_id    INT NOT NULL COMMENT '채팅방 ID',
    sender_id  INT NOT NULL COMMENT '보낸 사람 ID',
    content    VARCHAR(500) NOT NULL COMMENT '메시지 내용',
    sent_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                           COMMENT '보낸 시각',

    PRIMARY KEY (message_id),

    -- FK 설정
    CONSTRAINT fk_chat_message_room
        FOREIGN KEY (room_id)   REFERENCES chat_room(room_id),
    CONSTRAINT fk_chat_message_sender
        FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

CREATE TABLE chat_list (
    chat_list_id VARCHAR(100) NOT NULL COMMENT '개인대화목록 ID',
    user_id      INT          NOT NULL COMMENT '내부용 회원 ID',
    room_id      INT          NOT NULL COMMENT '채팅방 고유 ID',
    is_leaved    BOOLEAN      NOT NULL
                 DEFAULT FALSE
                 CHECK (is_leaved IN (0, 1))  -- TRUE/FALSE만 허용
                 COMMENT '채팅 나가기 여부',

    PRIMARY KEY (chat_list_id),

    CONSTRAINT fk_chat_list_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_chat_list_room
        FOREIGN KEY (room_id) REFERENCES chat_room(room_id)
);
