package com.spring_react.spring_react.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatVO {

    private Long messageId;
    private Long roomId;
    private Long senderId;
    private String content;
    private String sentAt;

}