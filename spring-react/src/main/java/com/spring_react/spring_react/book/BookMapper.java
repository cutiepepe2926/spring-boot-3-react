package com.spring_react.spring_react.book;

import com.spring_react.spring_react.command.MainBookVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BookMapper {

    // 중고도서 전체 목록
    List<MainBookVO> getMainBookList();

}
