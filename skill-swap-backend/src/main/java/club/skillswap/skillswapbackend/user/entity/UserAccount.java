package club.skillswap.skillswapbackend.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user_account")
@Getter
@Setter
public class UserAccount {

    // 主键，与 Supabase auth.users.id 对应
    @Id
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column
    private String bio;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    // --- 建立与其他实体的关联 ---

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSkill> skills;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private RatingSummary ratingSummary;

    // 注意：Review 中有两个 UserAccount 的外键，这里只映射用户作为评论者的关系
    @OneToMany(mappedBy = "reviewer")
    private List<Review> reviewsGiven;
}