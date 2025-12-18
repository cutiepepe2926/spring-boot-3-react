package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.bookregister.BookImageMapper;
import com.spring_react.spring_react.bookregister.BookRegisterService;
import com.spring_react.spring_react.command.BookRegisterVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.attribute.UserPrincipal;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BookRegisterController {

    private final BookRegisterService service;
    private final BookImageMapper bookImageMapper;


    // 🔥 책 등록
    @PostMapping("/books")
    public ResponseEntity<Void> register(
            @RequestParam String title,
            @RequestParam Integer price,
            @RequestParam String description,
            @RequestParam MultipartFile image
    ) throws Exception {

        // 1️⃣ 파일 저장
        String uploadDir = "C:/upload/books/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        File saveFile = new File(uploadDir + fileName);
        image.transferTo(saveFile);

        // 2️⃣ 책 정보 저장
        BookRegisterVO book = new BookRegisterVO();
        book.setTitle(title);
        book.setPrice(price);
        book.setDescription(description);
        book.setSellerId(1);
        book.setSellerName("어드민");

        service.registerBook(book);

        bookImageMapper.insertBookImage(
                UUID.randomUUID().toString(),   // image_id
                book.getBookId(),               // 방금 생성된 book_id
                "/images/books/" + fileName,    // image_url
                true                             // is_thumbnail
        );

        return ResponseEntity.ok().build();
    }



    // 🔥 책 목록 조회
    @GetMapping("/books")
    public List<BookRegisterVO> list() {
        return service.getBookList();
    }};