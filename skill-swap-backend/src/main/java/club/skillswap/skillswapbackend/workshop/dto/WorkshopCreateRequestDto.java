package club.skillswap.skillswapbackend.workshop.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

// 使用 record 简化代码
public record WorkshopCreateRequestDto(
    String title,
    String description,
    String category,
    String skillLevel,
    int duration,
    LocalDate date,
    LocalTime time,
    boolean isOnline,
    List<String> location,
    int maxParticipants,
    int creditReward,
    List<String> tags,
    List<String> materials,
    List<String> requirements
) {}