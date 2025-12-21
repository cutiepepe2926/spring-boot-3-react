package com.spring_react.spring_react.bookregister;

import com.spring_react.spring_react.command.BookRegisterVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Mapper
public interface BookRegisterMapper {

    void insertBook(BookRegisterVO book);

    List<BookRegisterVO> findAllBooks();


}