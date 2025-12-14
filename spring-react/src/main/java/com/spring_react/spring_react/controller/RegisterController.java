package com.spring_react.spring_react.controller;

import com.spring_react.spring_react.account.AccountService;
import com.spring_react.spring_react.command.UsersVO;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    @Autowired
    private AccountService accountService;

    // 회원가입 기능 API
    // 트랜잭션 - 실패 시 롤백
    @Transactional(rollbackFor = Exception.class)
    @PostMapping("/v1/register")
    public ResponseEntity<?> register(@RequestBody UsersVO users) {

        System.out.println(users.toString());

        // 1) 서버 검증 (단순 비교)
        String errorMsg = validate(users);
        if (errorMsg != null) {
            // 실패 시 에러 메시지 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMsg);
        }

        // 2) 가입 처리
        int result = accountService.userRegister(users);

        if (result == 1) {
            System.out.println("회원가입 성공");
            return ResponseEntity.ok("ok");
        }
        else {
            System.out.println("회원가입 실패");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("회원가입 실패: 아이디/이메일/전화번호를 확인하세요.");
        }
    }

    // 아이디 중복 체크 API
    @PostMapping("/v1/idCheck")
    public ResponseEntity<?> idCheck(@RequestBody Map<String, String> body) {

        String loginId = body.get("loginId"); // payload에서 값만 추출
        int result = accountService.isLoginIdExist(loginId);

        if (result >= 1) {
            System.out.println("해당 아이디는 이미 존재합니다!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("해당 아이디는 이미 존재합니다! 다른 아이디를 사용해주세요.");
        }
        else {
            System.out.println("아이디 사용 가능!");
            return ResponseEntity.ok("아이디 사용 가능!");
        }
    }


    // 프론트와 동일한 규칙
    private static final String ID_REGEX = "^[A-Za-z0-9]{4,20}$";     // 아이디: 4~20자(영문/숫자)
    private static final String NAME_REGEX = "^[가-힣]+$";             // 이름: 한글만
    private static final String PHONE_REGEX = "^010-\\d{4}-\\d{4}$";   // 전화번호: 010-0000-0000

    private String validate(UsersVO u) {
        // null-safe trim
        String loginId = safeTrim(u.getLoginId());
        String userName = safeTrim(u.getUser_name());
        String email = safeTrim(u.getEmail());
        String pw = safeTrim(u.getPw());
        String phone = safeTrim(u.getPhone());

        // 아이디
        if (loginId.isEmpty()) return "아이디는 필수입니다.";
        if (!loginId.matches(ID_REGEX)) return "아이디는 4~20자, 영문/숫자만 가능합니다.";

        // 이름
        if (userName.isEmpty()) return "이름은 필수입니다.";
        if (!userName.matches(NAME_REGEX)) return "이름은 한글만 입력 가능합니다.";

        // 이메일 (프론트는 type=email이지만 서버에서도 기본 형식 체크)
        if (email.isEmpty()) return "이메일은 필수입니다.";
        if (!email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
            return "이메일 형식이 올바르지 않습니다.";

        // 비밀번호
        if (pw.isEmpty()) return "비밀번호는 필수입니다.";
        if (pw.length() < 8 || pw.length() > 25) return "비밀번호는 8자 이상 25자 이하로 입력해주세요.";

        // 비밀번호 확인(passwordCheck)은 서버로 안 오므로 여기서는 검증 불가 (요청대로 무시)

        // 전화번호
        if (phone.isEmpty()) return "전화번호는 필수입니다.";
        if (!phone.matches(PHONE_REGEX)) return "전화번호는 010-0000-0000 형식으로 입력해주세요.";

        return null; // 통과
    }

    private String safeTrim(String s) {
        return s == null ? "" : s.trim();
    }

}
