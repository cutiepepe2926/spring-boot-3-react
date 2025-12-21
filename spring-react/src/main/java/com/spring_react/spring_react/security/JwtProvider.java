package com.spring_react.spring_react.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

//로그인 성공 시 Access JWT 문자열을 만들어서 반환하는 “토큰 발급기”


@Component
public class JwtProvider {

    private final Algorithm algorithm; // JWT에 서명(sign) 할 방식 (여기선 HMAC256)
    private final String issuer; // 발급자 값(검증할 때도 동일 값인지 확인 가능)
    private final long expirationMs; // 만료시간(밀리초)

    // 생성자: properties 값 주입 + Algorithm 생성
    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.issuer}") String issuer,
            @Value("${jwt.expiration-ms}") long expirationMs
    ) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.issuer = issuer;
        this.expirationMs = expirationMs;
    }

    // 이 secret을 이용해 토큰에 서명
    // 검증할 때도 같은 secret이 있어야 토큰이 진짜인지 확인 가능

    // createAccessToken: 토큰 발급 메서드
    public String createAccessToken(String loginId) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + expirationMs);

        return JWT.create() // 토큰 생성 시작
                .withIssuer(issuer) // 발급자 설정
                .withSubject(loginId) // 토큰 주인(여기선 loginId)
                .withIssuedAt(now) // 발급시간
                .withExpiresAt(expiresAt) //만료시간
                .sign(algorithm);
                // 서명된 JWT 문자열을 만들어 반환
    }

    public Authentication getAuthentication(String token) {

        DecodedJWT decodedJWT = JWT.require(algorithm)
                .withIssuer(issuer)
                .build()
                .verify(token);

        String loginId = decodedJWT.getSubject();

        return new UsernamePasswordAuthenticationToken(
                loginId,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}