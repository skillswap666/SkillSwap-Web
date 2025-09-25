package club.skillswap.skillswapbackend.user.dto;

import java.util.List;

import lombok.Data;

@Data
public class UpdateProfileRequestDto {
    // 前端可以只发送他们想更新的字段
    private String username;
    private String avatarUrl;
    private String bio;
    private List<String> skills;
    // 我们之后还可以添加技能列表等
}