package com.spring_react.spring_react.bookregister;

import com.spring_react.spring_react.command.BookRegisterVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookRegisterServiceImpl implements BookRegisterService {

    private final BookRegisterMapper mapper;
    private final BookImageMapper bookImageMapper; // ✅ 추가

    @Override
    public void registerBook(BookRegisterVO book) {
        mapper.insertBook(book);
    }

    @Override
    public List<BookRegisterVO> getBookList() {
        List<BookRegisterVO> books = mapper.findAllBooks();

        // 🔥 여기 추가
        for (BookRegisterVO book : books) {
            String imageUrl =
                    bookImageMapper.selectThumbnailByBookId(book.getBookId());
            book.setImageUrl(imageUrl);
        }

        return books;
    }
}