package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.ChatVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ChatMapper {
    int insertChatRoom(ChatRoomVO chatRoomVO);

    ChatRoomVO getChatRoomById(@Param("roomId") Long roomId, @Param("userId") Long userId);

    List<ChatRoomVO> getChatRoomList(Long userId);
    List<ChatVO> getChatMessages(Long roomId);
    int insertChatMessage(ChatVO chatVO);
}