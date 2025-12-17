package com.spring_react.spring_react.book;

import com.spring_react.spring_react.command.MainBookVO;

import java.util.List;

public interface BookService {

    List<MainBookVO> getMainBookList();

}