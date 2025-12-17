package com.spring_react.spring_react.config;

import com.spring_react.spring_react.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.issuer}")
    private String jwtIssuer;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
//                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 일단 로그인/회원가입은 열어두기 (경로는 API 엔드포인트가 추가될 경우 추가하기)
                        .requestMatchers( "/api/auth/v1/**").permitAll()
                        // 개발 초반엔 디버깅용 전부 허용 (JWT 붙이기 전까지만)
                        //.anyRequest().permitAll()
                        .requestMatchers(
                                "/", "/index.html",
                                "/static/**",
                                "/*.css", "/*.js", "/*.png", "/*.jpg", "/*.jpeg", "/*.svg", "/*.ico",
                                "/assets/**"
                        ).permitAll()
                                .anyRequest().permitAll()
                        //.anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthFilter(jwtSecret, jwtIssuer), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // React(3000) -> Spring(8080) 호출 허용
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization","Content-Type"));
        config.setAllowCredentials(false); // Access JWT만 쓸 거라 false -> 추후 refresh JWT 쓸거면 true로 변경

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // 비밀번호 해싱용(회원가입/로그인에서 사용)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
