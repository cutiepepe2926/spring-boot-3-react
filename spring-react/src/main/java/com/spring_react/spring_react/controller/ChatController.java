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
    public ChatRoomVO createChatRoom(@RequestBody ChatRoomVO room) {
        return chatService.createChatRoom(
                room.getBookId(),
                room.getSellerId(),
                room.getBuyerId()
        );
    }

    @GetMapping("/rooms")
    public List<ChatRoomVO> getChatRoomList(@RequestParam("userId") String userId) {
        // String으로 받아서 숫자가 아닌 문자를 제거한 뒤 Long으로 변환
        Long userNo = Long.valueOf(userId.replaceAll("[^0-9]", ""));
        return chatService.getChatRoomList(userNo);
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

        // senderId가 문자열(abc123)로 들어올 경우를 대비해 숫자만 추출하여 변환
        String senderIdStr = body.get("senderId").toString().replaceAll("[^0-9]", "");

        // 만약 숫자 추출 결과가 빈 문자열이라면 기본값(예: 1)을 설정하여 에러 방지
        Long senderId = senderIdStr.isEmpty() ? 1L : Long.valueOf(senderIdStr);

        chatVO.setSenderId(senderId);
        chatVO.setContent(body.get("content").toString());

        chatService.sendMessage(chatVO);
    }
}