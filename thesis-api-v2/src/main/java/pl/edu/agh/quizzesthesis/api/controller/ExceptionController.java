package pl.edu.agh.quizzesthesis.api.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import pl.edu.agh.quizzesthesis.api.dto.TextResponse;
import pl.edu.agh.quizzesthesis.business.exception.NotFoundException;

@ControllerAdvice
public class ExceptionController extends ResponseEntityExceptionHandler {

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<TextResponse> handleBadCredentials() {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new TextResponse("Wrong login or password"));
    }

    @ExceptionHandler({AuthenticationException.class})
    public ResponseEntity<TextResponse> handleAuthenticationError() {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new TextResponse("User unauthorized"));
    }

    @ExceptionHandler({DataIntegrityViolationException.class})
    public ResponseEntity<TextResponse> handleDBConflict() {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new TextResponse("Violating data integrity"));
    }

    @ExceptionHandler({NotFoundException.class})
    public ResponseEntity<TextResponse> resourceNotFound(NotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new TextResponse(e.getMessage()));
    }
}
