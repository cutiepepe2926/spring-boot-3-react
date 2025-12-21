package com.spring_react.spring_react.bookregister;

import com.spring_react.spring_react.command.BookRegisterVO;

import java.util.List;

public interface BookRegisterService {

    void registerBook(BookRegisterVO book);

    List<BookRegisterVO> getBookList();
}