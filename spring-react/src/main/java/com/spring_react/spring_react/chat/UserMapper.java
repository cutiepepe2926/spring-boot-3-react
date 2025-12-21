package com.spring_react.spring_react.chat;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    int findUserIdByLoginId(String loginId);

}
