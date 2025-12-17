package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatRoomVO;
import com.spring_react.spring_react.command.ChatVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMapper chatMapper;

    @Override
    @Transactional
    public ChatRoomVO createChatRoom(Long bookId, Long sellerId, Long buyerId) {

        // 1. 채팅방 생성
        chatMapper.insertChatRoom(bookId, sellerId, buyerId);

        // 2. 방금 생성된 roomId 조회
        // ⚠️ MyBatis에서 useGeneratedKeys 사용 전제
        Long roomId = chatMapper
                .getChatRoomList(buyerId)
                .get(0)
                .getRoomId();

        // 3. 생성된 채팅방 반환
        return chatMapper.getChatRoomById(roomId);
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