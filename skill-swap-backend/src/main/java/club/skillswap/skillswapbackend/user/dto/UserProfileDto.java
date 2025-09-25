package club.skillswap.skillswapbackend.user.dto;

import lombok.Data;

import java.time.Instant;
import java.util.UUID;

import club.skillswap.skillswapbackend.user.entity.UserAccount;

@Data
public class UserProfileDto {
    private UUID id;
    private String username;
    private String avatarUrl;
    private String bio;
    private Instant createdAt;

    // 一个方便的转换方法
    public static UserProfileDto fromEntity(UserAccount user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}