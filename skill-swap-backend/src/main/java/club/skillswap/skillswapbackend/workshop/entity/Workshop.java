package club.skillswap.skillswapbackend.workshop.entity;

import club.skillswap.skillswapbackend.user.entity.UserAccount;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.CascadeType;

@Entity
@Table(name = "workshops")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    
    @Column(name = "skill_level")
    private String skillLevel;

    private int duration;

    private String status = "upcoming"; // 默认状态

    private LocalDate date;
    private LocalTime time;

    @Column(name = "is_online")
    private boolean isOnline;


    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "workshop_locations", joinColumns = @JoinColumn(name = "workshop_id"))
    @Column(name = "location")
    private List<String> location;

    @Column(name = "max_participants")
    private int maxParticipants;

    @Column(name = "credit_reward")
    private int creditReward;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facilitator_id", nullable = false)
    private UserAccount facilitator; // 与用户实体的多对一关系

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "workshop_tags", joinColumns = @JoinColumn(name = "workshop_id"))
    @Column(name = "tag")
    private List<String> tags;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "workshop_materials", joinColumns = @JoinColumn(name = "workshop_id"))
    @Column(name = "material")
    private List<String> materials;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "workshop_requirements", joinColumns = @JoinColumn(name = "workshop_id"))
    @Column(name = "requirement")
    private List<String> requirements;

}