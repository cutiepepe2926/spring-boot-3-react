package com.spring_react.spring_react.command;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsersVO {
    private int userId; // user_id
    private String loginId; // login_id
    private String pw;
    private String user_name;
    private String email;
    private String phone;
    private LocalDateTime createdAt; // created_at -> DB에서 자동으로 현재 시각 값 채움.
}
