package pl.edu.agh.quizzesthesis.business.exception;

import org.springframework.security.core.AuthenticationException;

public class UnknownUserException extends AuthenticationException {

    public UnknownUserException(String message, Throwable cause) {
        super(message, cause);
    }

    public UnknownUserException(String message) {
        super(message);
    }
}
