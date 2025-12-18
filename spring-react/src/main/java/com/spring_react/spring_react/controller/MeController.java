package com.spring_react.spring_react.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class MeController {

    @GetMapping("/api/me")
    public Map<String, Object> me(Authentication authentication) {
        // JwtAuthFilter가 인증 성공 시 authentication.getName() = loginId
        return Map.of(
                //"loginId", authentication.getName()
                "loginId", "admin"
        );
    }
}
