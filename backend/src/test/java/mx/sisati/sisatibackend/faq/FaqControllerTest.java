package mx.sisati.sisatibackend.faq;

import mx.sisati.sisatibackend.faq.dto.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FaqControllerTest {

    @Mock
    private FaqService faqService;

    @InjectMocks
    private FaqController faqController;

    private static final Long CATEGORIA_ID = 1L;
    private static final Long PREGUNTA_ID = 1L;
    private static final String CATEGORIA_NOMBRE = "Pagos";
    private static final String PREGUNTA_TEXTO = "Como puedo pagar?";
    private static final String RESPUESTA_TEXTO = "Puedes pagar con tarjeta";

    private CategoriaFaqDto crearCategoriaDto() {
        return CategoriaFaqDto.builder()
                .id(CATEGORIA_ID)
                .nombre(CATEGORIA_NOMBRE)
                .descripcion("Categoria de pagos")
                .icono("CreditCard")
                .orden(1)
                .activa(true)
                .build();
    }

    private PreguntaFaqDto crearPreguntaDto() {
        return PreguntaFaqDto.builder()
                .id(PREGUNTA_ID)
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .orden(1)
                .activa(true)
                .build();
    }

    private CategoriaPreguntasDto crearCategoriaPreguntasDto() {
        return CategoriaPreguntasDto.builder()
                .categoria(crearCategoriaDto())
                .preguntas(List.of(crearPreguntaDto()))
                .build();
    }

    // ===== Tests para GET /faqs/categorias-preguntas =====

    @Test
    void obtenerTodasLasCategorias_cuandoHayDatos_retorna200ConLista() {
        CategoriaPreguntasDto dto = crearCategoriaPreguntasDto();
        when(faqService.obtenerTodas()).thenReturn(List.of(dto));

        ResponseEntity<?> response = faqController.obtenerTodasLasCategorias();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(List.class);
        assertThat((List<?>) response.getBody()).hasSize(1);
        verify(faqService).obtenerTodas();
    }

    @Test
    void obtenerTodasLasCategorias_cuandoBDVacia_retorna204() {
        when(faqService.obtenerTodas()).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = faqController.obtenerTodasLasCategorias();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        assertThat(response.getBody()).isNull();
    }

    @Test
    void obtenerTodasLasCategorias_cuandoError_retorna500() {
        when(faqService.obtenerTodas()).thenThrow(new RuntimeException("Error de conexion"));

        ResponseEntity<?> response = faqController.obtenerTodasLasCategorias();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
    }

    // ===== Tests para GET /faqs (con filtro por categoria) =====

    @Test
    void obtenerFaqs_sinFiltro_cuandoHayDatos_retorna200ConTodasLasCategorias() {
        CategoriaPreguntasDto dto = crearCategoriaPreguntasDto();
        when(faqService.obtenerTodas()).thenReturn(List.of(dto));

        ResponseEntity<?> response = faqController.obtenerFaqs(null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat((List<?>) response.getBody()).hasSize(1);
        verify(faqService).obtenerTodas();
        verify(faqService, never()).obtenerPorCategoria(any());
    }

    @Test
    void obtenerFaqs_conFiltroCategoria_cuandoExiste_retorna200ConCategoria() {
        CategoriaPreguntasDto dto = crearCategoriaPreguntasDto();
        when(faqService.obtenerPorCategoria(CATEGORIA_NOMBRE)).thenReturn(dto);

        ResponseEntity<?> response = faqController.obtenerFaqs(CATEGORIA_NOMBRE);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat((List<?>) response.getBody()).hasSize(1);
        verify(faqService).obtenerPorCategoria(CATEGORIA_NOMBRE);
    }

    @Test
    void obtenerFaqs_conFiltroCategoria_cuandoNoExiste_retorna204() {
        when(faqService.obtenerPorCategoria(CATEGORIA_NOMBRE)).thenReturn(null);

        ResponseEntity<?> response = faqController.obtenerFaqs(CATEGORIA_NOMBRE);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void obtenerFaqs_conFiltroCategoria_cuandoSinPreguntas_retorna204() {
        CategoriaPreguntasDto dto = CategoriaPreguntasDto.builder()
                .categoria(crearCategoriaDto())
                .preguntas(Collections.emptyList())
                .build();
        when(faqService.obtenerPorCategoria(CATEGORIA_NOMBRE)).thenReturn(dto);

        ResponseEntity<?> response = faqController.obtenerFaqs(CATEGORIA_NOMBRE);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void obtenerFaqs_sinFiltro_cuandoBDVacia_retorna204() {
        when(faqService.obtenerTodas()).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = faqController.obtenerFaqs(null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void obtenerFaqs_cuandoError_retorna500() {
        when(faqService.obtenerTodas()).thenThrow(new RuntimeException("Error"));

        ResponseEntity<?> response = faqController.obtenerFaqs(null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ===== Tests para GET /faqs/buscar =====

    @Test
    void buscarPreguntas_cuandoHayResultados_retorna200ConLista() {
        PreguntaFaqDto dto = crearPreguntaDto();
        when(faqService.buscarPreguntas("pagar")).thenReturn(List.of(dto));

        ResponseEntity<?> response = faqController.buscarPreguntas("pagar");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat((List<?>) response.getBody()).hasSize(1);
        verify(faqService).buscarPreguntas("pagar");
    }

    @Test
    void buscarPreguntas_cuandoSinResultados_retorna204() {
        when(faqService.buscarPreguntas("inexistente")).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = faqController.buscarPreguntas("inexistente");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void buscarPreguntas_cuandoError_retorna500() {
        when(faqService.buscarPreguntas("test")).thenThrow(new RuntimeException("Error de busqueda"));

        ResponseEntity<?> response = faqController.buscarPreguntas("test");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ===== Tests para POST /faqs/categorias =====

    @Test
    void crearCategoria_cuandoEsValida_retorna201ConCategoriaCreada() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre(CATEGORIA_NOMBRE)
                .descripcion("Descripcion")
                .icono("CreditCard")
                .orden(1)
                .build();

        CategoriaFaqDto resultado = crearCategoriaDto();
        when(faqService.crearCategoria(dto)).thenReturn(resultado);

        ResponseEntity<?> response = faqController.crearCategoria(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(resultado);
        verify(faqService).crearCategoria(dto);
    }

    @Test
    void crearCategoria_cuandoNombreDuplicado_retorna400() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre(CATEGORIA_NOMBRE)
                .build();

        when(faqService.crearCategoria(dto))
                .thenThrow(new IllegalArgumentException("Ya existe una categoria con el nombre: " + CATEGORIA_NOMBRE));

        ResponseEntity<?> response = faqController.crearCategoria(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void crearCategoria_cuandoErrorInesperado_retorna500() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre(CATEGORIA_NOMBRE)
                .build();

        when(faqService.crearCategoria(dto)).thenThrow(new RuntimeException("Error inesperado"));

        ResponseEntity<?> response = faqController.crearCategoria(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ===== Tests para PUT /faqs/categorias/{id} =====

    @Test
    void actualizarCategoria_cuandoExiste_retorna200ConCategoriaActualizada() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre("Pagos Actualizados")
                .build();

        CategoriaFaqDto resultado = CategoriaFaqDto.builder()
                .id(CATEGORIA_ID)
                .nombre("Pagos Actualizados")
                .build();

        when(faqService.actualizarCategoria(eq(CATEGORIA_ID), any(CreateUpdateCategoriaFaqDto.class)))
                .thenReturn(resultado);

        ResponseEntity<?> response = faqController.actualizarCategoria(CATEGORIA_ID, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(resultado);
    }

    @Test
    void actualizarCategoria_cuandoNoExiste_retorna400() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre("Test")
                .build();

        when(faqService.actualizarCategoria(eq(CATEGORIA_ID), any(CreateUpdateCategoriaFaqDto.class)))
                .thenThrow(new IllegalArgumentException("Categoria no encontrada con id: " + CATEGORIA_ID));

        ResponseEntity<?> response = faqController.actualizarCategoria(CATEGORIA_ID, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // ===== Tests para DELETE /faqs/categorias/{id} =====

    @Test
    void eliminarCategoria_cuandoExiste_retorna204() {
        doNothing().when(faqService).eliminarCategoria(CATEGORIA_ID);

        ResponseEntity<?> response = faqController.eliminarCategoria(CATEGORIA_ID);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(faqService).eliminarCategoria(CATEGORIA_ID);
    }

    @Test
    void eliminarCategoria_cuandoNoExiste_retorna400() {
        doThrow(new IllegalArgumentException("Categoria no encontrada con id: " + CATEGORIA_ID))
                .when(faqService).eliminarCategoria(CATEGORIA_ID);

        ResponseEntity<?> response = faqController.eliminarCategoria(CATEGORIA_ID);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // ===== Tests para POST /faqs/preguntas =====

    @Test
    void crearPregunta_cuandoEsValida_retorna201ConPreguntaCreada() {
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .orden(1)
                .build();

        PreguntaFaqDto resultado = crearPreguntaDto();
        when(faqService.crearPregunta(dto)).thenReturn(resultado);

        ResponseEntity<?> response = faqController.crearPregunta(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(resultado);
        verify(faqService).crearPregunta(dto);
    }

    @Test
    void crearPregunta_cuandoCategoriaNoExiste_retorna400() {
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .build();

        when(faqService.crearPregunta(dto))
                .thenThrow(new IllegalArgumentException("Categoria no encontrada con id: " + CATEGORIA_ID));

        ResponseEntity<?> response = faqController.crearPregunta(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void crearPregunta_cuandoErrorInesperado_retorna500() {
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .build();

        when(faqService.crearPregunta(dto)).thenThrow(new RuntimeException("Error inesperado"));

        ResponseEntity<?> response = faqController.crearPregunta(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ===== Tests para PUT /faqs/preguntas/{id} =====

    @Test
    void actualizarPregunta_cuandoExiste_retorna200ConPreguntaActualizada() {
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta("Pregunta Actualizada")
                .respuesta("Respuesta Actualizada")
                .build();

        PreguntaFaqDto resultado = PreguntaFaqDto.builder()
                .id(PREGUNTA_ID)
                .categoriaId(CATEGORIA_ID)
                .pregunta("Pregunta Actualizada")
                .respuesta("Respuesta Actualizada")
                .build();

        when(faqService.actualizarPregunta(eq(PREGUNTA_ID), any(CreateUpdatePreguntaFaqDto.class)))
                .thenReturn(resultado);

        ResponseEntity<?> response = faqController.actualizarPregunta(PREGUNTA_ID, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(resultado);
    }

    @Test
    void actualizarPregunta_cuandoNoExiste_retorna400() {
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta("Test")
                .respuesta("Test")
                .build();

        when(faqService.actualizarPregunta(eq(PREGUNTA_ID), any(CreateUpdatePreguntaFaqDto.class)))
                .thenThrow(new IllegalArgumentException("Pregunta no encontrada con id: " + PREGUNTA_ID));

        ResponseEntity<?> response = faqController.actualizarPregunta(PREGUNTA_ID, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // ===== Tests para DELETE /faqs/preguntas/{id} =====

    @Test
    void eliminarPregunta_cuandoExiste_retorna204() {
        doNothing().when(faqService).eliminarPregunta(PREGUNTA_ID);

        ResponseEntity<?> response = faqController.eliminarPregunta(PREGUNTA_ID);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(faqService).eliminarPregunta(PREGUNTA_ID);
    }

    @Test
    void eliminarPregunta_cuandoNoExiste_retorna400() {
        doThrow(new IllegalArgumentException("Pregunta no encontrada con id: " + PREGUNTA_ID))
                .when(faqService).eliminarPregunta(PREGUNTA_ID);

        ResponseEntity<?> response = faqController.eliminarPregunta(PREGUNTA_ID);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
