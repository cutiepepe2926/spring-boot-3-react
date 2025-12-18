package com.spring_react.spring_react.bookregister;

import com.spring_react.spring_react.command.BookRegisterVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookRegisterServiceImpl implements BookRegisterService {

    private final BookRegisterMapper mapper;

    @Override
    public void registerBook(BookRegisterVO book) {
        mapper.insertBook(book);
    }

    @Override
    public List<BookRegisterVO> getBookList() {
        return mapper.findAllBooks();
    }
}

