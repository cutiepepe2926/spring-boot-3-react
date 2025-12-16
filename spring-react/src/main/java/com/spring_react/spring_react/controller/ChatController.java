package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.chat.ChatService;
import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.ChatVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    @Autowired
    private ChatService chatService;

    /* 채팅방 목록 조회 */
    @GetMapping("/rooms")
    public List<ChatRoomVO> getChatRoomList(
            @RequestParam Long userId
    ) {
        return chatService.getChatRoomList(userId);
    }

    /* 채팅 메시지 목록 */
    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatVO> getChatMessages(
            @PathVariable Long roomId
    ) {
        return chatService.getChatMessages(roomId);
    }

    /* 메시지 전송 */
    @PostMapping("/rooms/{roomId}/messages")
    public void sendMessage(
            @PathVariable Long roomId,
            @RequestBody ChatVO chatVO
    ) {
        chatVO.setRoomId(roomId);
        chatService.sendMessage(chatVO);
    }

    /* 채팅방 생성 (필요 시) */
    @PostMapping("/rooms")
    public void createChatRoom(
            @RequestParam Long bookId,
            @RequestParam Long sellerId,
            @RequestParam Long buyerId
    ) {
        chatService.createChatRoom(bookId, sellerId, buyerId);
    }
}