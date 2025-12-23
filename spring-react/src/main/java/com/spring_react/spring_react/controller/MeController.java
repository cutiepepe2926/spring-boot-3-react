package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.chat.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MeController {

    private final UserService userService;

    @GetMapping("/api/me")
    public ResponseEntity<?> me(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        String loginId = authentication.getName();
        Integer userId = userService.findUserIdByLoginId(loginId);

        return ResponseEntity.ok(
                Map.of(
                        "loginId", loginId,
                        "userId", userId
                )
        );
    }
}