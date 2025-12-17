package com.spring_react.spring_react.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MainBookVO {

    private int bookId;              // 도서 ID
    private String title;            // 책 제목
    private int price;               // 가격
    private String imageUrl;         // 대표 이미지 URL
    private LocalDateTime createAt;  // 등록일
}