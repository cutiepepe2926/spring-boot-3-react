package com.spring_react.spring_react.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket //소켓을 활성화
public class WebSocketConfig implements WebSocketConfigurer {

    private SocketHandler socketHandler;

    public WebSocketConfig(SocketHandler socketHandler) {
        this.socketHandler = socketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {


        registry.addHandler(socketHandler, "/api/chat") //이 오청에 대해서 소켓 연결
                .setAllowedOriginPatterns("*") //모든 경로에 대해서 요청 허용
                .withSockJS(); //클라이언트에서 사용하는 SocketJS 라이브러리 허용함
    }
}