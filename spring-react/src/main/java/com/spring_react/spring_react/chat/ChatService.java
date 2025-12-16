package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.ChatVO;

import java.util.List;

public interface ChatService {

    void createChatRoom(Long bookId, Long sellerId, Long buyerId);

    List<ChatRoomVO> getChatRoomList(Long userId);

    List<ChatVO> getChatMessages(Long roomId);

    void sendMessage(ChatVO chatVO);
}