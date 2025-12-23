package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.chat.ChatService;
import com.spring_react.spring_react.command.ChatMessageVO;
import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.CloseEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // 채팅방 목록
    @GetMapping("/rooms")
    public List<ChatRoomVO> getRooms(Authentication authentication) {
        String loginId = authentication.getName();
        return chatService.getChatRooms(loginId);
    }

    // 채팅방 생성 or 조회
    @PostMapping("/rooms")
    public ChatRoomVO createRoom(Authentication authentication,
                                 @RequestBody ChatRoomVO vo) {
        String loginId = authentication.getName();

        try {
            return chatService.getOrCreateRoom(loginId, vo);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage()
            );
        }
    }

    // 메시지 목록
    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatMessageVO> getMessages(
            @PathVariable int roomId,
            Authentication authentication
    ) {
        String loginId = authentication.getName();
        return chatService.getMessages(roomId, loginId);
    }

    // 메시지 전송
    @PostMapping("/rooms/{roomId}/messages")
    public void sendMessage(
            @PathVariable int roomId,
            @RequestBody ChatMessageVO vo,
            Authentication authentication
    ) {
        String loginId = authentication.getName();
        vo.setRoomId(roomId);
        chatService.sendMessage(vo, loginId);
    }

    // 거래 종료
    @PostMapping("/rooms/{roomId}/close")
    public void closeDeal(
            @PathVariable int roomId,
            Authentication authentication
    ) {
        String loginId = authentication.getName();

        chatService.closeDeal(roomId, loginId);

        messagingTemplate.convertAndSend(
                "/topic/chat/rooms/" + roomId,
                CloseEvent.of()
        );
    }
}