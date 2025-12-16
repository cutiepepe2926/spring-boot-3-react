package com.spring_react.spring_react.book;

import com.spring_react.spring_react.command.BookVO;
import com.spring_react.spring_react.book.BookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class BookServiceImpl implements BookService {

    @Autowired
    private BookMapper bookMapper;

    @Override
    public List<BookVO> getBookList() {
        return bookMapper.getBookList();
    }

    @Override
    public BookVO getBook(String id) {
        return bookMapper.getBookById(id);
    }

    @Override
    public void registerBook(BookVO bookVO) {
        bookMapper.insertBook(bookVO);
    }

    @Override
    public void removeBook(String id) {
        bookMapper.deleteBook(id);
    }
}