package club.skillswap.skillswapbackend.workshop.controller;

import club.skillswap.skillswapbackend.workshop.dto.WorkshopCreateRequestDto;
import club.skillswap.skillswapbackend.workshop.dto.WorkshopResponseDto;
import club.skillswap.skillswapbackend.workshop.service.WorkshopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workshops")
@RequiredArgsConstructor // 使用 Lombok 自动注入 final 字段
public class WorkshopController {

    private final WorkshopService workshopService;

    @PostMapping
    public ResponseEntity<WorkshopResponseDto> createWorkshop(
            @RequestBody WorkshopCreateRequestDto createRequestDto,
            Authentication authentication) {
        // 从 Spring Security 的 Authentication 对象中获取用户ID
        String facilitatorId = authentication.getName(); // 通常是用户的唯一标识，如UUID
        WorkshopResponseDto createdWorkshop = workshopService.createWorkshop(createRequestDto, facilitatorId);
        return new ResponseEntity<>(createdWorkshop, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkshopResponseDto> getWorkshopById(@PathVariable Long id) {
        WorkshopResponseDto workshop = workshopService.getWorkshopById(id);
        return ResponseEntity.ok(workshop);
    }
    
    @GetMapping
    public ResponseEntity<List<WorkshopResponseDto>> getAllWorkshops() {
        List<WorkshopResponseDto> workshops = workshopService.getAllWorkshops();
        return ResponseEntity.ok(workshops);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkshop(@PathVariable Long id, Authentication authentication) {
        workshopService.deleteWorkshop(id, authentication);
        return ResponseEntity.noContent().build();
    }
}