package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.ChatVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMapper chatMapper;

    @Override
    public void createChatRoom(Long bookId, Long sellerId, Long buyerId) {
        chatMapper.insertChatRoom(bookId, sellerId, buyerId);
    }

    @Override
    public List<ChatRoomVO> getChatRoomList(Long userId) {
        return chatMapper.getChatRoomList(userId);
    }

    @Override
    public List<ChatVO> getChatMessages(Long roomId) {
        return chatMapper.getChatMessages(roomId);
    }

    @Override
    public void sendMessage(ChatVO chatVO) {
        chatMapper.insertChatMessage(chatVO);
    }
}