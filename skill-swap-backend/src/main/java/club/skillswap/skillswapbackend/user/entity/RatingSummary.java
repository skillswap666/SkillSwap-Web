package club.skillswap.skillswapbackend.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "rating_summary")
@Getter
@Setter
public class RatingSummary {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // 告诉 JPA 这个关系共享主键
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserAccount user;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}