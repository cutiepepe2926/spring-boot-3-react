package com.spring_react.spring_react.book;

import com.spring_react.spring_react.command.BookVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookMapper {

    // 중고도서 전체 목록
    List<BookVO> getBookList();

    // 중고도서 상세
    BookVO getBookById(String id);

    // 중고도서 등록
    int insertBook(BookVO bookVO);

    // 중고도서 삭제
    int deleteBook(String id);
}
