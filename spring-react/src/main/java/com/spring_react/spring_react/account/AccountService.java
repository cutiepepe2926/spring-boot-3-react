package com.spring_react.spring_react.account;

import com.spring_react.spring_react.command.UsersVO;

public interface AccountService {

    // 신규 유저 회원가입
    int userRegister(UsersVO usersVO);

}
