package club.skillswap.skillswapbackend.repository;

import club.skillswap.skillswapbackend.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserAccount, UUID> {
    // JpaRepository 已经提供了 findById 等我们需要的基本方法
}