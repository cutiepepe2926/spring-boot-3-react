package com.spring_react.spring_react.chat;

import com.spring_react.spring_react.command.ChatMessageVO;
import com.spring_react.spring_react.command.ChatRoomVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatMapper chatMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<ChatRoomVO> getChatRooms(String loginId) {
        int userId = userMapper.findUserIdByLoginId(loginId);
        return chatMapper.getChatRooms(userId);
    }

    @Override
    public ChatRoomVO getOrCreateRoom(String loginId, ChatRoomVO vo) {

        int buyerId = userMapper.findUserIdByLoginId(loginId);
        vo.setBuyerId(buyerId);

        ChatRoomVO room = chatMapper.selectChatRoom(vo);
        if (room != null) {
            return room;
        }

        try {
            chatMapper.insertChatRoom(vo);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            return chatMapper.selectChatRoom(vo);
        }

        return chatMapper.getChatRoomDetail(vo.getRoomId());
    }

    @Override
    public List<ChatMessageVO> getMessages(int roomId, String loginId) {

        int userId = userMapper.findUserIdByLoginId(loginId);

        System.out.println("getMessages 호출됨 / loginId = " + loginId);

        ChatRoomVO room = chatMapper.getChatRoomDetail(roomId);

        if (room == null ||
                (room.getSellerId() != userId && room.getBuyerId() != userId)) {
            throw new AccessDeniedException("채팅방 접근 권한 없음");
        }

        return chatMapper.selectMessagesByRoomId(roomId);
    }

    @Override
    public void sendMessage(ChatMessageVO vo, String loginId) {
        int senderId = userMapper.findUserIdByLoginId(loginId);

        vo.setSenderId(senderId);
        vo.setSentAt(LocalDateTime.now());

        chatMapper.insertChatMessage(vo);
    }
}

