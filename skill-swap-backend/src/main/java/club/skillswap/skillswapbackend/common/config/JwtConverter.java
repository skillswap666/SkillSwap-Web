package club.skillswap.skillswapbackend.common.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        // 从 JWT 中提取角色信息
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        
        // 创建一个 JwtAuthenticationToken，这是 Spring Security 内部表示认证用户的方式
        return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
    }

    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        // Supabase 将角色信息放在 "app_metadata" claim 中
        Map<String, Object> appMetadata = jwt.getClaimAsMap("app_metadata");
        
        if (appMetadata != null && appMetadata.get("roles") instanceof List) {
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) appMetadata.get("roles");
            
            // 将角色字符串（如 "ADMIN"）转换为 Spring Security 的 GrantedAuthority 对象
            // 关键：Spring Security 的 "hasRole" 方法需要权限以 "ROLE_" 开头
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        }
        
        // 如果没有角色信息，返回一个空列表
        return List.of();
    }
}