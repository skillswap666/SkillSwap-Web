package club.skillswap.skillswapbackend.workshop.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

public record WorkshopResponseDto(
    String id,
    String title,
    String description,
    String category,
    String skillLevel,
    String status,
    LocalDate date,
    LocalTime time,
    boolean isOnline,
    Set<String> location,
    int maxParticipants,
    int creditReward,
    FacilitatorDto facilitator,
    LocalDateTime createdAt
) {}