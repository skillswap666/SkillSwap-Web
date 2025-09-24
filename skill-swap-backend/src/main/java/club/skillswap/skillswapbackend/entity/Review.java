package club.skillswap.skillswapbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "review")
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "workshop_id", nullable = false)
    private Long workshopId; // 暂时作为普通字段，因为 Workshop 实体在其他模块

    // 评论者
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private UserAccount reviewer;

    // 被评论的主持人
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    private UserAccount host;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating; // 使用 BigDecimal 来精确表示 4.5 这样的半星

    @Column
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}