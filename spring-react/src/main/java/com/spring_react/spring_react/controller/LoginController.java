package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.account.AccountService;
import com.spring_react.spring_react.command.UsersVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/v1/login")
    public ResponseEntity<?> login(@RequestBody UsersVO usersVO) {



        return ResponseEntity.ok("로그인 성공!");
    }


}
