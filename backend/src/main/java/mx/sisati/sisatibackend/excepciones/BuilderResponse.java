package mx.sisati.sisatibackend.excepciones;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class BuilderResponse {

    public static ResponseEntity<ErrorResponse> build(HttpStatus badRequest, String invalid_params, String exception) {
        return ResponseEntity
                .status(badRequest)
                .body(new ErrorResponse(
                        badRequest.value(),
                        invalid_params,
                        exception
                ));
    }
}
