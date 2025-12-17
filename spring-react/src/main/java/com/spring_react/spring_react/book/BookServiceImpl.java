package com.spring_react.spring_react.book;

import com.spring_react.spring_react.command.MainBookVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class BookServiceImpl implements BookService {

    @Autowired
    private BookMapper bookMapper;

    @Override
    public List<MainBookVO> getMainBookList() {
        return bookMapper.getMainBookList();
    }

}