package com.spring_react.spring_react.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

// 요청 1번당 필터 1번만 실행
public class JwtAuthFilter extends OncePerRequestFilter {

    private final Algorithm algorithm;
    private final String issuer;

    public JwtAuthFilter(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.issuer}") String issuer
    ) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.issuer = issuer;
    }

    // 매 요청마다 실행되는 필터
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String auth = request.getHeader("Authorization");

        // 토큰이 없거나 Bearer 형식이 아니면 통과 -> 처리는 시큐리티가 담당
        if (auth == null || !auth.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Bearer 접두사 떼고 토큰 문자열만 추출
        String token = auth.substring("Bearer ".length());


        // 토큰 검증: 서명/issuer/만료시간까지 확인
        try {
            DecodedJWT jwt = JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token);

            String loginId = jwt.getSubject(); // 우리가 subject에 loginId 넣었음

            // 인증된 사용자로 스프링 시큐리티에 등록
            var authentication = new UsernamePasswordAuthenticationToken(
                    loginId, null, Collections.emptyList()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            // 토큰이 이상하면 인증 정보 비우고 통과(보호 API면 결국 401됨)
            SecurityContextHolder.clearContext();
        }

        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}

//브라우저 요청
//   |
//   v
//[JwtAuthFilter]  <-- 여기서 토큰 검사
//   |
//   |-- 토큰 OK -> SecurityContext에 로그인 정보 저장
//   |
//   |-- 토큰 X/만료/위조 -> 그냥 통과(로그인 안 된 상태)
//   v
//[권한 체크]  <-- authenticated()면 여기서 401/403 발생 가능
//   v
//컨트롤러 실행