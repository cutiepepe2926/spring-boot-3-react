package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatMessageVO;
import com.spring_react.spring_react.command.ChatRoomVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {

    // 채팅방 목록
    List<ChatRoomVO> getChatRooms(int userId);

    // 채팅방 단건 조회
    ChatRoomVO selectChatRoom(ChatRoomVO vo);

    // 채팅방 생성
    void insertChatRoom(ChatRoomVO vo);

    // 메시지 목록
    List<ChatMessageVO> selectMessagesByRoomId(int roomId);

    // 메시지 저장
    void insertChatMessage(ChatMessageVO vo);

    ChatRoomVO getChatRoomDetail(int roomId);
}