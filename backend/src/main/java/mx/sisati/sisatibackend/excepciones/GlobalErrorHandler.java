package mx.sisati.sisatibackend.excepciones;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalErrorHandler {
    // POR FALTA DE IMAGINACION LOS invalid_params SON DEMASIADO GENERICOS, DESPUES LO ARREGLO
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> IllegalArgumentExceptionHandler(IllegalArgumentException exception){
        return BuilderResponse.build(HttpStatus.BAD_REQUEST, "Parametros invalidos", exception.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> UsernameNotFoundExceptionHandler(UsernameNotFoundException exception){
        return BuilderResponse.build(HttpStatus.NOT_FOUND, "El usuario no fue encontrado", exception.getMessage());
    }

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ErrorResponse> DomainExceptionHandler(DomainException exception){
        return BuilderResponse.build(HttpStatus.BAD_REQUEST, "Los campos no fueron llenados correctamente", exception.getMessage());
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> ServiceExceptionHandler(ServiceException exception){
        return BuilderResponse.build(HttpStatus.BAD_REQUEST, "Nuestro servicio rechazó su petición", exception.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> BadCredentialsExceptionHandler(BadCredentialsException exception){
        return BuilderResponse.build(HttpStatus.BAD_REQUEST, "Login incorrecto, intentelo de nuevo", exception.getMessage());
    }
}
