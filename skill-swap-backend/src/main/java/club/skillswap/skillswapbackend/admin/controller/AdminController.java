package club.skillswap.skillswapbackend.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    @GetMapping("/hello")
    @PreAuthorize("hasRole('ADMIN')") // 关键！只有拥有 'ROLE_ADMIN' 权限的用户才能访问
    public ResponseEntity<String> adminOnlyEndpoint() {
        return ResponseEntity.ok("Hello Admin! You have successfully accessed a protected resource.");
    }
}