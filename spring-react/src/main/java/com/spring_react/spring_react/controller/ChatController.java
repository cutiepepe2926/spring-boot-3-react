package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.chat.ChatService;
import com.spring_react.spring_react.command.ChatMessageVO;
import com.spring_react.spring_react.command.ChatRoomVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    // 채팅방 목록
    @GetMapping("/rooms")
    public List<ChatRoomVO> getRooms(Authentication authentication) {
        String loginId = (String) authentication.getPrincipal();
        return chatService.getChatRooms(loginId);
    }

    // 채팅방 생성 or 조회
    @PostMapping("/rooms")
    public ChatRoomVO createRoom(
            Authentication authentication,
            @RequestBody ChatRoomVO vo
    ) {
        String loginId = (String) authentication.getPrincipal();
        return chatService.getOrCreateRoom(loginId, vo);
    }

    // 메시지 목록
    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatMessageVO> getMessages(
            @PathVariable int roomId,
            Authentication authentication
    ) {
        String loginId = (String) authentication.getPrincipal();
        return chatService.getMessages(roomId, loginId);
    }

    // 메시지 전송
    @PostMapping("/rooms/{roomId}/messages")
    public void sendMessage(
            @PathVariable int roomId,
            @RequestBody ChatMessageVO vo,
            Authentication authentication
    ) {
        String loginId = (String) authentication.getPrincipal();

        vo.setRoomId(roomId);
        chatService.sendMessage(vo, loginId);
    }
}
