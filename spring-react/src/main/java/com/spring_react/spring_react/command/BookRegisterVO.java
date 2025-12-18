package com.spring_react.spring_react.command;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;



import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookRegisterVO {

    private Integer bookId;
    private Integer sellerId;
    private String title;
    private String sellerName;
    private Integer price;
    private String description;
    private String status;
    private LocalDateTime createAt;
}
