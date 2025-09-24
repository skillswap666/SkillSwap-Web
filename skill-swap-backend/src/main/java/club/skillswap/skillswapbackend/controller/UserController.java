package club.skillswap.skillswapbackend.controller;

import club.skillswap.skillswapbackend.dto.UserProfileDto;
import club.skillswap.skillswapbackend.entity.UserAccount;
import club.skillswap.skillswapbackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 获取当前登录用户的信息。
     * @AuthenticationPrincipal Jwt jwt 会自动注入经过验证的 JWT 对象。
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        // 使用 "find or create" 逻辑来获取用户
        UserAccount currentUser = userService.findOrCreateCurrentUser(jwt);
        // 将实体转换为 DTO 以便返回给前端
        UserProfileDto userProfileDto = UserProfileDto.fromEntity(currentUser);
        return ResponseEntity.ok(userProfileDto);
    }

    /**
     * 根据 ID 获取任何用户的公开信息。
     * 这个端点是公开的，由 SecurityConfig 配置。
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserProfileById(@PathVariable UUID id) {
        UserAccount user = userService.findUserById(id);
        UserProfileDto userProfileDto = UserProfileDto.fromEntity(user);
        return ResponseEntity.ok(userProfileDto);
    }
}