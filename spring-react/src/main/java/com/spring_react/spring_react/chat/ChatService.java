package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatMessageVO;
import com.spring_react.spring_react.command.ChatRoomVO;

import java.util.List;

public interface ChatService {

    List<ChatRoomVO> getChatRooms(String loginId);

    ChatRoomVO getOrCreateRoom(String loginId, ChatRoomVO vo);

    List<ChatMessageVO> getMessages(int roomId, String loginId);

    void sendMessage(ChatMessageVO vo, String loginId);
}
