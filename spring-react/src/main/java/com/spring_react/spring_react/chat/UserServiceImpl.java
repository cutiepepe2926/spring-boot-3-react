package com.spring_react.spring_react.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Override
    public Integer findUserIdByLoginId(String loginId) {
        return userMapper.findUserIdByLoginId(loginId);
    }
}