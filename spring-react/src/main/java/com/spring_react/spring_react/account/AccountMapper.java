package com.spring_react.spring_react.account;

import com.spring_react.spring_react.command.UsersVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountMapper {

    // 신규 유저 회원가입
    int userRegisterDB(UsersVO usersVO);

}
