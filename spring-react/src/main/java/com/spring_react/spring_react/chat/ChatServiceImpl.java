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
        int sellerId = chatMapper.findSellerIdByBookId(vo.getBookId());

        if (buyerId == sellerId) {
            throw new IllegalStateException("본인 상품은 구매할 수 없습니다.");
        }

        vo.setBuyerId(buyerId);
        vo.setSellerId(sellerId);

        ChatRoomVO room = chatMapper.selectChatRoom(vo);
        if (room != null) {
            return room;
        }

        chatMapper.insertChatRoom(vo);
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
        vo.setSenderLoginId(loginId);
        vo.setSentAt(LocalDateTime.now());

        chatMapper.insertChatMessage(vo);
    }

    @Override
    @Transactional
    public void closeDeal(int roomId, String loginId) {

        int userId = userMapper.findUserIdByLoginId(loginId);
        ChatRoomVO room = chatMapper.getChatRoomDetail(roomId);

        if (room == null) {
            throw new IllegalArgumentException("채팅방이 존재하지 않습니다.");
        }

        // 상품 상태 → 판매완료
        chatMapper.updateBookStatus(room.getBookId(), "판매완료");

        // 해당 상품의 모든 채팅방 종료
        chatMapper.closeChatRoomsByBookId(room.getBookId());
    }

}
