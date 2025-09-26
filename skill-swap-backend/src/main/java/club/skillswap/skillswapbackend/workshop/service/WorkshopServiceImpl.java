package club.skillswap.skillswapbackend.workshop.service;

import club.skillswap.skillswapbackend.common.exception.ResourceNotFoundException;
import club.skillswap.skillswapbackend.user.entity.UserAccount;
import club.skillswap.skillswapbackend.user.service.UserService;
import club.skillswap.skillswapbackend.workshop.dto.WorkshopCreateRequestDto;
import club.skillswap.skillswapbackend.workshop.dto.WorkshopResponseDto;
import club.skillswap.skillswapbackend.workshop.dto.FacilitatorDto;
import club.skillswap.skillswapbackend.workshop.entity.Workshop;
import club.skillswap.skillswapbackend.workshop.repository.WorkshopRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkshopServiceImpl implements WorkshopService {

    private final WorkshopRepository workshopRepository;
    private final UserService userService;

    @Override
    @Transactional
    public WorkshopResponseDto createWorkshop(WorkshopCreateRequestDto createRequestDto, String facilitatorId) {
        // 1. 根据 facilitatorId 查找用户
        UserAccount facilitator = userService.findUserByStringId(facilitatorId);

        // 2. 将 DTO 转换为 Entity
        Workshop workshop = new Workshop();
        workshop.setTitle(createRequestDto.title());
        workshop.setDescription(createRequestDto.description());
        workshop.setCategory(createRequestDto.category());
        workshop.setSkillLevel(createRequestDto.skillLevel());
        workshop.setDuration(createRequestDto.duration());
        workshop.setDate(createRequestDto.date());
        workshop.setTime(createRequestDto.time());
        workshop.setOnline(createRequestDto.isOnline());
        workshop.setLocation(createRequestDto.location());
        workshop.setMaxParticipants(createRequestDto.maxParticipants());
        workshop.setCreditReward(createRequestDto.creditReward());
        workshop.setTags(createRequestDto.tags());
        workshop.setMaterials(createRequestDto.materials());
        workshop.setRequirements(createRequestDto.requirements());
        workshop.setFacilitator(facilitator);

        // ... 调用积分服务 ...

        // 3. 保存到数据库
        Workshop savedWorkshop = workshopRepository.save(workshop);

        // 4. 将保存后的 Entity 转换回 Response DTO 并返回
        return mapToDto(savedWorkshop);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkshopResponseDto getWorkshopById(Long id) {
        Workshop workshop = workshopRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop not found with ID: " + id));
        
        return mapToDto(workshop);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkshopResponseDto> getAllWorkshops() {
        List<Workshop> workshops = workshopRepository.findAllWithFacilitator();
        // 触发懒加载
        workshops.forEach(w -> {
            w.getLocation().size();
            w.getTags().size();
            w.getMaterials().size();
            w.getRequirements().size();
        });
        return workshops.stream().map(this::mapToDto).toList();
    }

    @Override
    @Transactional
    public void deleteWorkshop(Long workshopId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login.");
        }

        // 1. 根据ID查找Workshop，如果找不到则抛出异常
        Workshop workshop = workshopRepository.findById(workshopId)
                .orElseThrow(() -> new ResourceNotFoundException("Workshop not found with ID: " + workshopId));

        // 2. 获取当前操作用户的ID和角色
        String currentUserId = extractUserId(authentication);
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));

        // 3. 获取Workshop创建者的ID
        String facilitatorId = workshop.getFacilitator().getId().toString();

        // 4. 权限校验：
        // 如果当前用户既不是Admin，也不是该Workshop的创建者，则抛出403 Forbidden异常
        if (!isAdmin && !currentUserId.equals(facilitatorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this workshop.");
        }

        // 5. 如果权限校验通过，则执行删除操作
        workshopRepository.delete(workshop);
    }

    // 私有辅助方法，用于将 Entity 映射到 DTO
    private WorkshopResponseDto mapToDto(Workshop workshop) {

        // 创建嵌套的 FacilitatorDto
        FacilitatorDto facilitatorDto = new FacilitatorDto(
            "u_" + workshop.getFacilitator().getId(), // 假设UserAccount的ID是UUID，自动转为String
            workshop.getFacilitator().getUsername(),
            workshop.getFacilitator().getAvatarUrl() // 假设UserAccount有getAvatarUrl()方法
        );

        return new WorkshopResponseDto(
            "w_" + workshop.getId(),
            workshop.getTitle(),
            workshop.getDescription(),
            workshop.getCategory(),
            workshop.getSkillLevel(),
            workshop.getStatus(),
            workshop.getDate(),
            workshop.getTime(),
            workshop.isOnline(),
            workshop.getLocation(),
            workshop.getMaxParticipants(),
            workshop.getCreditReward(),
            facilitatorDto,
            workshop.getCreatedAt()
            );
    }

    private String extractUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login.");
        }

        // 1) Spring Resource Server（Bearer JWT）
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            // 一般就是用户的 UUID（JWT 的 sub）
            return jwtAuth.getToken().getSubject();
            // 也可以从 claim 里取：jwtAuth.getTokenAttributes().get("sub")
        }

        // 2) 传统表单/自定义 UserDetails
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails ud) {
            // 通常是用户名；如果你的 username 存的是 UUID，这里就是 UUID
            return ud.getUsername();
        }

        // 3) OAuth2 Login（Google/GitHub/…）
        if (principal instanceof DefaultOAuth2User ou) {
            Object sub = ou.getAttribute("sub"); // 有些提供方用 "id"
            if (sub != null) return sub.toString();
            Object id = ou.getAttribute("id");
            if (id != null) return id.toString();
            return ou.getName(); // fallback
        }

        // 4) 兜底
        return authentication.getName();
    }
}