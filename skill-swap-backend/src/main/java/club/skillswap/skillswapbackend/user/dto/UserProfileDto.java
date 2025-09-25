package club.skillswap.skillswapbackend.user.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;
import java.util.List; // 引入 List
import java.util.stream.Collectors;

import club.skillswap.skillswapbackend.user.entity.UserAccount;
import club.skillswap.skillswapbackend.user.entity.UserSkill;

@Data
public class UserProfileDto {
    private UUID id;
    private String username;
    private String avatarUrl;
    private String bio;
    private List<String> skills;
    private Instant createdAt;
    private Instant updatedAt;
    

    // 一个方便的转换方法
    public static UserProfileDto fromEntity(UserAccount user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        if (user.getSkills() != null) {
            dto.setSkills(user.getSkills().stream()
                    .map(UserSkill::getSkillName) // 使用方法引用，从 UserSkill 对象中提取 skillName 字符串
                    .collect(Collectors.toList()));
        } else {
            dto.setSkills(List.of()); // 如果没有技能，设置为空列表
        }
        return dto;
    }
}