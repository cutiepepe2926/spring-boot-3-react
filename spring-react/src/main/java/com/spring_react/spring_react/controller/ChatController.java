package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.chat.ChatService;
import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.ChatVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/rooms")
    public ChatRoomVO createChatRoom(@RequestBody Map<String, Object> body) {
        return chatService.createChatRoom(
                Long.valueOf(body.get("bookId").toString()),
                Long.valueOf(body.get("sellerId").toString()),
                Long.valueOf(body.get("buyerId").toString())
        );
    }

    @GetMapping("/rooms")
    public List<ChatRoomVO> getChatRoomList(@RequestParam("userId") String userId) {
        // String으로 받아서 숫자인 경우에만 처리하거나, 서비스 단에서 형변환 하도록 수정
        return chatService.getChatRoomList(Long.valueOf(userId.replaceAll("[^0-9]", "")));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public List<ChatVO> getChatMessages(@PathVariable("roomId") Long roomId) {
        return chatService.getChatMessages(roomId);
    }

    @PostMapping("/rooms/{roomId}/messages")
    public void sendMessage(@PathVariable("roomId") Long roomId,
                            @RequestBody Map<String, Object> body) {

        ChatVO chatVO = new ChatVO();
        chatVO.setRoomId(roomId);
        chatVO.setSenderId(Long.valueOf(body.get("senderId").toString()));
        chatVO.setContent(body.get("content").toString());

        chatService.sendMessage(chatVO);
    }
}