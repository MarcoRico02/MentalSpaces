package mx.sisati.sisatibackend.excepciones;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class BuilderResponse {

    public static ResponseEntity<ErrorResponse> build(HttpStatus badRequest, String error, String exception) {
        return ResponseEntity
                .status(badRequest)
                .body(new ErrorResponse(
                        badRequest.value(),
                        error,
                        exception
                ));
    }
}
