package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.account.AccountService;
import com.spring_react.spring_react.command.UsersVO;
import com.spring_react.spring_react.controller.dto.LoginResponse;
import com.spring_react.spring_react.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/v1/login")
    public ResponseEntity<?> login(@RequestBody UsersVO usersVO) {

        if (usersVO == null || usersVO.getLoginId() == null || usersVO.getPw() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("아이디/비밀번호는 필수입니다.");
        }

        System.out.println(usersVO);

        int result = accountService.userLogin((usersVO));

        if (result != 1) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        String token = jwtProvider.createAccessToken(usersVO.getLoginId());
        return ResponseEntity.ok(new LoginResponse(token));

    }


}
