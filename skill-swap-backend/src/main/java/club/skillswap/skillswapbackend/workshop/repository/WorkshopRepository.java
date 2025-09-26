package club.skillswap.skillswapbackend.workshop.repository;

import club.skillswap.skillswapbackend.workshop.entity.Workshop;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {
    // JpaRepository 已经提供了 save(), findById(), findAll() 等基础方法
    // 后续我们可以根据筛选需求，在这里添加自定义查询方法
    @Query("SELECT DISTINCT w FROM Workshop w " +
           "LEFT JOIN FETCH w.facilitator " +
           "LEFT JOIN FETCH w.location " +
           "LEFT JOIN FETCH w.tags " +
           "LEFT JOIN FETCH w.materials " +
           "LEFT JOIN FETCH w.requirements " +
           "WHERE w.id = :id")
    Optional<Workshop> findByIdWithDetails(@Param("id") Long id);
    @Query("""
            select distinct w from Workshop w
            left join fetch w.facilitator
            """)
    List<Workshop> findAllWithFacilitator();
}