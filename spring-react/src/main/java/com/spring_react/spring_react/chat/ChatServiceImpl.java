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

        ChatRoomVO vo = new ChatRoomVO();
        vo.setBookId(bookId);
        vo.setSellerId(sellerId);
        vo.setBuyerId(buyerId);

        // insertChatRoom 실행 시 XML의 useGeneratedKeys에 의해 vo.roomId에 값이 들어감
        chatMapper.insertChatRoom(vo);

        // 생성된 roomId를 사용하여 전체 정보(상품명, 닉네임 등)가 포함된 데이터 조회
        ChatRoomVO result = chatMapper.getChatRoomById(vo.getRoomId(), buyerId);

        if (result == null) {
            return vo;
        }

        return result;
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
    @Transactional
    public void sendMessage(ChatVO chatVO) {
        chatMapper.insertChatMessage(chatVO);
    }
}