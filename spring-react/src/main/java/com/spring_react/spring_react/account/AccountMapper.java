package com.spring_react.spring_react.account;

import com.spring_react.spring_react.command.UsersVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountMapper {

    // 신규 유저 회원가입
    int userRegisterDB(UsersVO usersVO);

    // 회원가입 아이디 중복 체크
    int isLoginIdExistDB(String loginId);

    // 유저 로그인
    int userLoginDB(UsersVO usersVO);
}
