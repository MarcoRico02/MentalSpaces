package mx.sisati.sisatibackend.faq;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.sisati.sisatibackend.faq.dto.CategoriaPreguntasDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para gestionar Preguntas Frecuentes (FAQs)
 * Endpoints públicos - sin requerimiento de autenticación
 */
@RestController
@RequestMapping("/faqs")
@RequiredArgsConstructor
@Slf4j
@Tag(
    name = "FAQs",
    description = "Endpoints públicos para gestionar Preguntas Frecuentes"
)
public class FaqController {

    private final FaqService faqService;

    /**
     * Obtiene todas las categorías de FAQs con sus preguntas
     * o preguntas de una categoría específica si se proporciona el parámetro
     */
    @GetMapping
    @Operation(
        summary = "Obtener FAQs por categoría",
        description = "Obtiene las preguntas frecuentes. Si se especifica una categoría, retorna solo las preguntas de esa categoría. Si no se especifica, retorna todas las categorías con sus preguntas."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "FAQs encontrados exitosamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(
                    type = "array",
                    implementation = CategoriaPreguntasDto.class
                )
            )
        ),
        @ApiResponse(
            responseCode = "204",
            description = "No se encontraron FAQs para la categoría especificada"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Parámetro inválido"
        )
    })
    public ResponseEntity<?> obtenerFaqs(
        @Parameter(
            name = "categoria",
            description = "Nombre de la categoría para filtrar FAQs (opcional)",
            example = "Pagos"
        )
        @RequestParam(value = "categoria", required = false) String categoria
    ) {
        log.info("GET /faqs - Solicitando FAQs. Categoría: {}", categoria);

        try {
            List<CategoriaPreguntasDto> faqs;

            if (categoria != null && !categoria.trim().isEmpty()) {
                // Obtener FAQs de una categoría específica
                CategoriaPreguntasDto faq = faqService.obtenerPorCategoria(categoria);

                if (faq == null || faq.getPreguntas().isEmpty()) {
                    log.info("No se encontraron FAQs para la categoría: {}", categoria);
                    return ResponseEntity.noContent().build();
                }

                faqs = List.of(faq);
            } else {
                // Obtener todas las categorías con sus preguntas
                faqs = faqService.obtenerTodas();

                if (faqs.isEmpty()) {
                    log.info("No se encontraron FAQs");
                    return ResponseEntity.noContent().build();
                }
            }

            log.info("Retornando {} categoría(s) con FAQs", faqs.size());
            return ResponseEntity.ok(faqs);

        } catch (Exception e) {
            log.error("Error al obtener FAQs: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error al obtener FAQs"));
        }
    }

    /**
     * DTO para respuestas de error
     */
    private static class ErrorResponse {
        public String mensaje;

        public ErrorResponse(String mensaje) {
            this.mensaje = mensaje;
        }
    }
}

