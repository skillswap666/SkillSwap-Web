package club.skillswap.skillswapbackend.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 通用的业务逻辑异常。
 * 当这个异常被抛出时，通常意味着一个违反了业务规则的无效操作，
 * 例如，尝试添加一个空的技能，或者技能数量超过上限。
 * 我们把它映射到 HTTP 400 Bad Request 状态码。
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DomainException extends RuntimeException {

    public DomainException(String message) {
        super(message);
    }

    public DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}