package club.skillswap.skillswapbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_skill")
@Getter
@Setter
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 多对一关联到 UserAccount
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // 防止在序列化时产生循环引用
    private UserAccount user;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(name = "skill_level")
    private String skillLevel;
}
