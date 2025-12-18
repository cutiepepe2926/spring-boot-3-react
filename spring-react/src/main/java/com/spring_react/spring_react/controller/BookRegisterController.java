package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.bookregister.BookRegisterService;
import com.spring_react.spring_react.command.BookRegisterVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BookRegisterController {

    private final BookRegisterService service;

    // 🔥 책 등록
    @PostMapping("/books")
    public ResponseEntity<Void> register(@RequestBody BookRegisterVO book) {
        System.out.println("일단,서버로 넘오옴");

        // 🔥 지금은 admin으로 고정
        book.setSellerId(1);
        book.setSellerName("어드민");

        service.registerBook(book);
        return ResponseEntity.ok().build();
    }

    // 🔥 책 목록 조회
    @GetMapping
    public List<BookRegisterVO> list() {
        return service.getBookList();
    }
}

