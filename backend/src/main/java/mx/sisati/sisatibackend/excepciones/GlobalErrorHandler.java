package mx.sisati.sisatibackend.excepciones;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@RestControllerAdvice
public class GlobalErrorHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> IllegalArgumentExceptionHandler(IllegalArgumentException exception){
        return BuilderResponse.build(HttpStatus.BAD_REQUEST, "BAD_REQUEST", exception.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> UsernameNotFoundExceptionHandler(UsernameNotFoundException exception){
        return BuilderResponse.build(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", exception.getMessage());
    }

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ErrorResponse> DomainExceptionHandler(DomainException exception){
        return BuilderResponse.build(HttpStatus.BAD_REQUEST, "INVALID_ENTITY_FIELDS", exception.getMessage());
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> ServiceExceptionHandler(ServiceException exception){
        return BuilderResponse.build(HttpStatus.BAD_REQUEST, "SERVICE_REJECTED", exception.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> BadCredentialsExceptionHandler(BadCredentialsException exception){
        return BuilderResponse.build(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> GenericExceptionHandler(Exception exception){
        return BuilderResponse.build(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", exception.getMessage());
    }
}
