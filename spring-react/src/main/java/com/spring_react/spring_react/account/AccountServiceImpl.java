package com.spring_react.spring_react.account;

import com.spring_react.spring_react.command.UsersVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service("accountService")
public class AccountServiceImpl implements AccountService {

    @Autowired
    @Qualifier("accountMapper")
    private AccountMapper accountMapper;

    // 유저 회원가입 서비스
    @Override
    public int userRegister(UsersVO usersVO) {
        return accountMapper.userRegisterDB(usersVO);
    }

}
