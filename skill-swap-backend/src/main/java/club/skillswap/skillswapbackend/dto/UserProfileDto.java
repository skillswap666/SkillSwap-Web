package club.skillswap.skillswapbackend.dto;

import club.skillswap.skillswapbackend.entity.UserAccount;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

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