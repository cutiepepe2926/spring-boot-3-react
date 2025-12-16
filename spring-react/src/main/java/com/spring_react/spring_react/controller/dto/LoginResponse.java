package com.spring_react.spring_react.controller.dto;

public class LoginResponse {
    private final String accessToken;

    public LoginResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    //스프링(Jackson)이 이 getter를 보고 JSON으로 변환할 때
    //키 이름을 accessToken으로 만들고
    //값으로 토큰 문자열을 넣어줌

    // [React]  ---- id,pw ---->  [LoginRequest DTO]  ->  (서비스/DB)
    // [React]  <--- token ------  [LoginResponse DTO] <-  (컨트롤러)

}
