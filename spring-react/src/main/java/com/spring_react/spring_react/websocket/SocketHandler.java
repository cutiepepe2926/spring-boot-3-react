package com.spring_react.spring_react.websocket;

import com.spring_react.spring_react.chat.ChatService;
import com.spring_react.spring_react.chat.UserMapper;
import com.spring_react.spring_react.command.ChatMessageVO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class SocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final UserMapper userMapper;

    @MessageMapping("/chat/rooms/{roomId}/messages")
    public void sendMessage(
            @DestinationVariable int roomId,
            ChatMessageVO message,
            Principal principal
    ) {

        String loginId = principal.getName();

        int senderId = userMapper.findUserIdByLoginId(loginId);

        message.setRoomId(roomId);
        message.setSenderId(senderId);
        message.setSenderLoginId(loginId);
        message.setSentAt(LocalDateTime.now());


        chatService.sendMessage(message, loginId);

        messagingTemplate.convertAndSend(
                "/topic/chat/rooms/" + roomId,
                message
        );
    }
}
