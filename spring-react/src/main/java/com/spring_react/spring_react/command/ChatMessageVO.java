package com.spring_react.spring_react.command;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageVO {

    private Integer messageId;
    private Integer roomId;
    private Integer senderId;
    private String senderLoginId;
    private String content;
    private LocalDateTime sentAt;
}