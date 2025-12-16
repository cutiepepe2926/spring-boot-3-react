package com.spring_react.spring_react.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {

//    @GetMapping("/api/hello")
    @GetMapping("/hello")
    public String test() {
        return "Hello, world!";
    }

    @GetMapping("/api/test")
    public String test(Authentication authentication) {
        // JwtAuthFilter가 인증을 성공시키면 authentication.getName()에 loginId 들어있음
        return "OK, loginId = " + authentication.getName();
    }
}