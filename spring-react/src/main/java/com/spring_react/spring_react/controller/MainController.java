package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.book.BookService;
import com.spring_react.spring_react.command.MainBookVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class MainController {

    @Autowired
    private BookService bookService;

    @GetMapping("/main")
    public List<MainBookVO> getMainBookList() {
        return bookService.getMainBookList();
    }
}