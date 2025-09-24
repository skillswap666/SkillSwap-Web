package club.skillswap.skillswapbackend.service;


import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.lang3.RandomStringUtils;

import club.skillswap.skillswapbackend.entity.UserAccount;
import club.skillswap.skillswapbackend.repository.UserRepository;
import club.skillswap.skillswapbackend.exception.ResourceNotFoundException;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 根据用户 ID 查找用户公开信息。
     * 如果找不到会抛出异常。
     */
    public UserAccount findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "ID", userId));
    }

    /**
     * 获取当前认证的用户。
     * 如果这是用户第一次访问，会自动为他们创建一个 UserAccount 资料记录。
     */
    @Transactional
    public UserAccount findOrCreateCurrentUser(Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());

        // 尝试根据 JWT 中的用户 ID 查找用户
        Optional<UserAccount> existingUser = userRepository.findById(userId);

        // 如果用户存在，直接返回
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        // --- 用户不存在，这是关键：自动创建新用户资料 ---
        UserAccount newUser = new UserAccount();
        newUser.setId(userId);

        String email = jwt.getClaimAsString("email");
        String baseUsername = email.split("@")[0]
                                .replaceAll("[^a-zA-Z0-9]", "_"); // 清理特殊字符

        // --- 健壮的用户名生成逻辑 ---
        String finalUsername = baseUsername;
        // 循环检查，直到找到一个不重复的用户名
        while (userRepository.findByUsername(finalUsername).isPresent()) {
            // 如果重复，就在后面加上 4 位随机字母和数字
            finalUsername = baseUsername + "_" + RandomStringUtils.randomAlphanumeric(4);
        }
        newUser.setUsername(finalUsername);
        
        // 你可以在这里设置其他默认值，例如 avatarUrl
        
        return userRepository.save(newUser);
    }
}