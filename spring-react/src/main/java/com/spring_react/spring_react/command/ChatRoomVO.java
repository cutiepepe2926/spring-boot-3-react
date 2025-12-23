package com.spring_react.spring_react.command;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatRoomVO {

    private int roomId;
    private int bookId;
    private int sellerId;
    private int buyerId;
    private LocalDateTime createdAt;

    private String sellerLoginId;
    private String buyerLoginId;

    private String lastMessage;
    private String lastTime;
    private String productStatus;
    private String bookTitle;
    private int price;

    private String imageUrl;
}