package pl.edu.agh.quizzesthesis.business.exception;

import org.springframework.security.core.AuthenticationException;

public class AuthTokenInvalidException extends AuthenticationException {

    public AuthTokenInvalidException(String message, Throwable cause) {
        super(message, cause);
    }

    public AuthTokenInvalidException(String message) {
        super(message);
    }
}
