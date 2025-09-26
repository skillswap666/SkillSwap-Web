package club.skillswap.skillswapbackend.user.service;


import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.lang3.RandomStringUtils;

import club.skillswap.skillswapbackend.common.exception.DomainException;
import club.skillswap.skillswapbackend.common.exception.ResourceNotFoundException;
import club.skillswap.skillswapbackend.user.dto.UpdateProfileRequestDto;
import club.skillswap.skillswapbackend.user.dto.UserProfileDto;
import club.skillswap.skillswapbackend.user.dto.SkillRequestDto;
import club.skillswap.skillswapbackend.user.entity.UserAccount;
import club.skillswap.skillswapbackend.user.entity.UserSkill;
import club.skillswap.skillswapbackend.user.repository.UserRepository;

import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Locale;
import java.util.List;

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
     * 根据字符串形式的用户 ID 查找用户公开信息。
     * 这个方法主要是为了配合 WorkshopService 的需求。
     * 如果找不到会抛出异常。
     */
    public UserAccount findUserByStringId(String userId) {
        // 1. 在这里，我们将 String 转换为 UUID
        UUID userUuid;
        try {
            userUuid = UUID.fromString(userId);
        } catch (IllegalArgumentException e) {
            // 如果传入的字符串格式不正确，可以抛出自定义异常或返回错误
            throw new ResourceNotFoundException("Invalid user ID format: " + userId);
        }

        // 2. 调用上面那个已经存在的、接收 UUID 的 findUserById 方法
        // 或者直接调用 repository 的 findById，效果一样
        return findUserById(userUuid);
    }

    /**
     * 获取当前认证的用户。
     * 如果这是用户第一次访问，会自动为他们创建一个 UserAccount 资料记录。
     */
    @Transactional
    public UserProfileDto findOrCreateCurrentUserProfile(Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        // 查找或创建实体
        UserAccount user = userRepository.findById(userId).orElseGet(() -> {
            // 这部分逻辑只在用户不存在时执行
            UserAccount newUser = new UserAccount();
            newUser.setId(userId);
            String email = jwt.getClaimAsString("email");
            String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "_");
            
            String finalUsername = baseUsername;
            while (userRepository.findByUsername(finalUsername).isPresent()) {
                finalUsername = baseUsername + "_" + RandomStringUtils.randomAlphanumeric(4);
            }
            newUser.setUsername(finalUsername);
            return userRepository.save(newUser);
        });

        // 在事务结束前，将实体转换为 DTO
        return UserProfileDto.fromEntity(user);
    }

    /**
     * 更新当前认证用户的个人资料。
     */
    @Transactional
    public UserAccount updateCurrentUserProfile(Jwt jwt, UpdateProfileRequestDto updateRequest) {
        UUID userId = UUID.fromString(jwt.getSubject());
        
        // 我们使用 findById，而不是 findOrCreate，因为能调用这个方法的用户肯定已经存在了
        UserAccount userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "ID", userId));

        // --- 部分更新逻辑 ---
        // 只有当请求中的字段不为 null 时，才更新对应的实体字段
        if (updateRequest.getUsername() != null) {
            // 你可能需要在这里添加检查，确保新用户名没有被其他人占用
            userToUpdate.setUsername(updateRequest.getUsername());
        }
        if (updateRequest.getAvatarUrl() != null) {
            userToUpdate.setAvatarUrl(updateRequest.getAvatarUrl());
        }
        if (updateRequest.getBio() != null) {
            userToUpdate.setBio(updateRequest.getBio());
        }
        if (updateRequest.getSkills() != null) {
            // 1. 清空用户当前的技能列表
            //    由于我们设置了 orphanRemoval = true, 这会自动删除数据库中的旧记录
            userToUpdate.getSkills().clear();

            // 2. 将前端传来的字符串列表转换为 UserSkill 实体列表
            List<UserSkill> newSkills = updateRequest.getSkills().stream()
                    .map(skillName -> {
                        // 对每个技能名称进行标准化和验证
                        String normalizedSkill = normalizeSkill(skillName);
                        requireNonBlank(normalizedSkill);
                        
                        UserSkill newSkill = new UserSkill();
                        newSkill.setSkillName(normalizedSkill);
                        newSkill.setUser(userToUpdate); // 关联回当前用户
                        return newSkill;
                    })
                    .collect(Collectors.toList());

            // 3. 将新的技能列表添加到用户实体中
            userToUpdate.getSkills().addAll(newSkills);
        }

        return userRepository.save(userToUpdate);
    }

    /**
     * 为当前认证的用户添加一项新技能。
     * 包含了完整的验证和标准化逻辑。
     */
    @Transactional
    public UserAccount addSkillToCurrentUser(Jwt jwt, SkillRequestDto skillRequest) {
        UUID userId = UUID.fromString(jwt.getSubject());
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "ID", userId));

        // 1. 标准化输入
        String normalizedSkill = normalizeSkill(skillRequest.getSkillName());

        // 2. 验证业务规则
        requireNonBlank(normalizedSkill);
        
        // 3. 检查技能是否已存在
        boolean skillExists = user.getSkills().stream()
                .anyMatch(skill -> skill.getSkillName().equals(normalizedSkill));

        if (skillExists) {
            return user; // 如果已存在，直接返回，不执行任何操作
        }

        // 4. 创建并添加新技能
        UserSkill newSkill = new UserSkill();
        newSkill.setSkillName(normalizedSkill);
        newSkill.setUser(user);

        user.getSkills().add(newSkill);

        // 5. 保存父实体，JPA 的 cascade 会自动保存新技能
        return userRepository.save(user);
    }

    /**
     * 从当前认证用户的技能列表中删除一项技能（通过名称）。
     */
    @Transactional
    public boolean removeSkillFromCurrentUserByName(Jwt jwt, String skillName) {
        UUID userId = UUID.fromString(jwt.getSubject());
        UserAccount user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserAccount", "ID", userId));
        
        String normalizedSkill = normalizeSkill(skillName);

        boolean removed = user.getSkills().removeIf(skill -> skill.getSkillName().equals(normalizedSkill));

        if (removed) {
            userRepository.save(user); // 只有在真的移除了技能时才保存
        }

        return removed;
    }

    // ============== 私有辅助方法 (验证与标准化) ==============

    /**
     * 统一技能的大小写和空格，避免 "React" 和 " react " 被视为不同技能。
     */
    private String normalizeSkill(String skill) {
        return skill == null ? null : skill.trim().toLowerCase(Locale.ROOT);
    }

    /**
     * 验证技能字符串不能为空。
     */
    private void requireNonBlank(String skill) {
        if (skill == null || skill.isBlank()) {
            // 建议创建一个通用的业务异常，或者使用 IllegalArgumentException
            throw new DomainException("Skill name must not be blank.");
        }
    }
}