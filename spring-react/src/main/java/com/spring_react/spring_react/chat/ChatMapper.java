package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.ChatVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {

    // 채팅방 생성
    int insertChatRoom(Long bookId, Long sellerId, Long buyerId);

    // 채팅방 목록 (내 채팅 리스트)
    List<ChatRoomVO> getChatRoomList(Long userId);

    // 채팅 메시지 목록
    List<ChatVO> getChatMessages(Long roomId);

    // 메시지 전송
    int insertChatMessage(ChatVO chatVO);
}