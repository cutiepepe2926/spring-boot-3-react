package com.spring_react.spring_react.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomVO {

    private Long roomId;
    private Long bookId;

    private String productName;
    private int productPrice;
    private String productStatus;

    private String otherUserName;
    private String lastTime;

}