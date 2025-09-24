package club.skillswap.skillswapbackend.service;

import club.skillswap.skillswapbackend.entity.UserAccount;
import club.skillswap.skillswapbackend.repository.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
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

        // 从 JWT 中获取 email，并用它来生成一个默认的 username
        String email = jwt.getClaimAsString("email");
        String defaultUsername = email.split("@")[0]; // 例如, "john.doe@email.com" -> "john.doe"
        newUser.setUsername(defaultUsername);
        
        // 你可以在这里设置其他默认值，例如 avatarUrl
        
        return userRepository.save(newUser);
    }
}