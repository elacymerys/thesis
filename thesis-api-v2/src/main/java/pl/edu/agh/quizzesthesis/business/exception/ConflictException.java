package pl.edu.agh.quizzesthesis.business.exception;

public class ConflictException extends RuntimeException {

    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }

    public ConflictException(String message) {
        super(message);
    }
}
