package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.account.AccountService;
import com.spring_react.spring_react.command.UsersVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    @Autowired
    private AccountService accountService;

    // 회원가입 기능 API
    // 트랜잭션 - 실패 시 롤백
    @Transactional(rollbackFor = Exception.class)
    @PostMapping("/v1/register")
    public ResponseEntity<?> register(@RequestBody UsersVO users) {

        System.out.println(users.toString());

        int result = accountService.userRegister(users);

        if (result == 1) {
            System.out.println("회원가입 성공");
            return ResponseEntity.ok("ok");
        }
        else {
            System.out.println("회원가입 실패");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("회원가입 실패: 아이디/이메일/전화번호를 확인하세요.");
        }
    }

}
