package club.skillswap.skillswapbackend.workshop.service;

import club.skillswap.skillswapbackend.workshop.dto.WorkshopCreateRequestDto;
import club.skillswap.skillswapbackend.workshop.dto.WorkshopResponseDto;

import org.springframework.security.core.Authentication;

import java.util.List;

public interface WorkshopService {
    
    WorkshopResponseDto createWorkshop(WorkshopCreateRequestDto createRequestDto, String facilitatorId);

    WorkshopResponseDto getWorkshopById(Long id);

    List<WorkshopResponseDto> getAllWorkshops();
    
    void deleteWorkshop(Long workshopId, Authentication authentication);
}