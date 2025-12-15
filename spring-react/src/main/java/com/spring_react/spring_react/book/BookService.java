package com.spring_react.spring_react.account;

import com.spring_react.spring_react.command.BookVO;

import java.util.List;

public interface BookService {

    List<BookVO> getBookList();

    BookVO getBook(String id);

    void registerBook(BookVO bookVO);

    void removeBook(String id);
}