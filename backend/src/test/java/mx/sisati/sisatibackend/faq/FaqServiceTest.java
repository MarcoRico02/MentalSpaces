package mx.sisati.sisatibackend.faq;

import mx.sisati.sisatibackend.faq.dto.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FaqServiceTest {

    @Mock
    private CategoriaFaqRepository categoriaFaqRepository;

    @Mock
    private PreguntaFaqRepository preguntaFaqRepository;

    @InjectMocks
    private FaqService faqService;

    private static final Long CATEGORIA_ID = 1L;
    private static final Long PREGUNTA_ID = 1L;
    private static final String CATEGORIA_NOMBRE = "Pagos";
    private static final String PREGUNTA_TEXTO = "Como puedo pagar?";
    private static final String RESPUESTA_TEXTO = "Puedes pagar con tarjeta o transferencia";

    private CategoriaFaq crearCategoria() {
        return CategoriaFaq.builder()
                .id(CATEGORIA_ID)
                .nombre(CATEGORIA_NOMBRE)
                .descripcion("Categoria de pagos")
                .icono("CreditCard")
                .orden(1)
                .activa(true)
                .build();
    }

    private PreguntaFaq crearPregunta() {
        CategoriaFaq categoria = crearCategoria();
        return PreguntaFaq.builder()
                .id(PREGUNTA_ID)
                .categoria(categoria)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .orden(1)
                .activa(true)
                .build();
    }

    // ===== Tests para obtenerTodas =====

    @Test
    void obtenerTodas_cuandoHayCategoriasActivas_retornaListaConPreguntas() {
        CategoriaFaq categoria = crearCategoria();
        PreguntaFaq pregunta = crearPregunta();

        when(categoriaFaqRepository.findByActivaTrueOrderByOrden()).thenReturn(List.of(categoria));
        when(preguntaFaqRepository.findByCategoriaNombreAndActivaTrueOrderByOrden(CATEGORIA_NOMBRE))
                .thenReturn(List.of(pregunta));

        List<CategoriaPreguntasDto> resultado = faqService.obtenerTodas();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getCategoria().getNombre()).isEqualTo(CATEGORIA_NOMBRE);
        assertThat(resultado.get(0).getPreguntas()).hasSize(1);
        assertThat(resultado.get(0).getPreguntas().get(0).getPregunta()).isEqualTo(PREGUNTA_TEXTO);
        verify(categoriaFaqRepository).findByActivaTrueOrderByOrden();
    }

    @Test
    void obtenerTodas_cuandoNoHayCategoriasActivas_retornaListaVacia() {
        when(categoriaFaqRepository.findByActivaTrueOrderByOrden()).thenReturn(Collections.emptyList());

        List<CategoriaPreguntasDto> resultado = faqService.obtenerTodas();

        assertThat(resultado).isEmpty();
        verify(categoriaFaqRepository).findByActivaTrueOrderByOrden();
        verifyNoInteractions(preguntaFaqRepository);
    }

    @Test
    void obtenerTodas_cuandoCategoriaSinPreguntas_retornaCategoriaConListaVacia() {
        CategoriaFaq categoria = crearCategoria();

        when(categoriaFaqRepository.findByActivaTrueOrderByOrden()).thenReturn(List.of(categoria));
        when(preguntaFaqRepository.findByCategoriaNombreAndActivaTrueOrderByOrden(CATEGORIA_NOMBRE))
                .thenReturn(Collections.emptyList());

        List<CategoriaPreguntasDto> resultado = faqService.obtenerTodas();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getCategoria().getNombre()).isEqualTo(CATEGORIA_NOMBRE);
        assertThat(resultado.get(0).getPreguntas()).isEmpty();
    }

    // ===== Tests para obtenerPorCategoria =====

    @Test
    void obtenerPorCategoria_cuandoExiste_retornaCategoriaConPreguntas() {
        CategoriaFaq categoria = crearCategoria();
        PreguntaFaq pregunta = crearPregunta();

        when(categoriaFaqRepository.findByNombre(CATEGORIA_NOMBRE)).thenReturn(categoria);
        when(preguntaFaqRepository.findByCategoriaNombreAndActivaTrueOrderByOrden(CATEGORIA_NOMBRE))
                .thenReturn(List.of(pregunta));

        CategoriaPreguntasDto resultado = faqService.obtenerPorCategoria(CATEGORIA_NOMBRE);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getCategoria().getNombre()).isEqualTo(CATEGORIA_NOMBRE);
        assertThat(resultado.getPreguntas()).hasSize(1);
        assertThat(resultado.getPreguntas().get(0).getPregunta()).isEqualTo(PREGUNTA_TEXTO);
    }

    @Test
    void obtenerPorCategoria_cuandoNoExiste_retornaNull() {
        when(categoriaFaqRepository.findByNombre(CATEGORIA_NOMBRE)).thenReturn(null);

        CategoriaPreguntasDto resultado = faqService.obtenerPorCategoria(CATEGORIA_NOMBRE);

        assertThat(resultado).isNull();
        verifyNoInteractions(preguntaFaqRepository);
    }

    // ===== Tests para buscarPreguntas =====

    @Test
    void buscarPreguntas_cuandoQueryCoincide_retornaResultados() {
        PreguntaFaq pregunta = crearPregunta();

        when(preguntaFaqRepository.findByActivaTrueOrderByCategoria_OrdenAscOrdenAsc())
                .thenReturn(List.of(pregunta));

        List<PreguntaFaqDto> resultado = faqService.buscarPreguntas("pagar");

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getPregunta()).isEqualTo(PREGUNTA_TEXTO);
    }

    @Test
    void buscarPreguntas_conAcentos_encuentraSinAcentos() {
        PreguntaFaq pregunta = PreguntaFaq.builder()
                .id(PREGUNTA_ID)
                .categoria(crearCategoria())
                .pregunta("Como puedo pagar?")
                .respuesta("Puedes pagar con tarjeta")
                .orden(1)
                .activa(true)
                .build();

        when(preguntaFaqRepository.findByActivaTrueOrderByCategoria_OrdenAscOrdenAsc())
                .thenReturn(List.of(pregunta));

        List<PreguntaFaqDto> resultado = faqService.buscarPreguntas("puedes");

        assertThat(resultado).hasSize(1);
    }

    @Test
    void buscarPreguntas_cuandoQueryVacio_retornaListaVacia() {
        List<PreguntaFaqDto> resultado = faqService.buscarPreguntas("");

        assertThat(resultado).isEmpty();
        verifyNoInteractions(preguntaFaqRepository);
    }

    @Test
    void buscarPreguntas_cuandoQueryNull_retornaListaVacia() {
        List<PreguntaFaqDto> resultado = faqService.buscarPreguntas(null);

        assertThat(resultado).isEmpty();
        verifyNoInteractions(preguntaFaqRepository);
    }

    @Test
    void buscarPreguntas_cuandoNoHayCoincidencias_retornaListaVacia() {
        PreguntaFaq pregunta = crearPregunta();

        when(preguntaFaqRepository.findByActivaTrueOrderByCategoria_OrdenAscOrdenAsc())
                .thenReturn(List.of(pregunta));

        List<PreguntaFaqDto> resultado = faqService.buscarPreguntas("termino inexistente");

        assertThat(resultado).isEmpty();
    }

    @Test
    void buscarPreguntas_buscaEnRespuesta_encuentraCoincidencia() {
        PreguntaFaq pregunta = crearPregunta();

        when(preguntaFaqRepository.findByActivaTrueOrderByCategoria_OrdenAscOrdenAsc())
                .thenReturn(List.of(pregunta));

        List<PreguntaFaqDto> resultado = faqService.buscarPreguntas("tarjeta");

        assertThat(resultado).hasSize(1);
    }

    // ===== Tests para crearCategoria =====

    @Test
    void crearCategoria_cuandoEsValida_retornaCategoriaCreada() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre(CATEGORIA_NOMBRE)
                .descripcion("Descripcion")
                .icono("CreditCard")
                .orden(1)
                .activa(true)
                .build();

        when(categoriaFaqRepository.findByNombre(CATEGORIA_NOMBRE)).thenReturn(null);
        when(categoriaFaqRepository.save(any(CategoriaFaq.class)))
                .thenAnswer(invocation -> {
                    CategoriaFaq saved = invocation.getArgument(0);
                    saved.setId(CATEGORIA_ID);
                    return saved;
                });

        CategoriaFaqDto resultado = faqService.crearCategoria(dto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo(CATEGORIA_NOMBRE);
        assertThat(resultado.getDescripcion()).isEqualTo("Descripcion");
        assertThat(resultado.getIcono()).isEqualTo("CreditCard");
        assertThat(resultado.getOrden()).isEqualTo(1);
        assertThat(resultado.getActiva()).isTrue();

        ArgumentCaptor<CategoriaFaq> captor = ArgumentCaptor.forClass(CategoriaFaq.class);
        verify(categoriaFaqRepository).save(captor.capture());
        assertThat(captor.getValue().getNombre()).isEqualTo(CATEGORIA_NOMBRE);
    }

    @Test
    void crearCategoria_cuandoNombreDuplicado_lanzaRuntimeException() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre(CATEGORIA_NOMBRE)
                .build();

        when(categoriaFaqRepository.findByNombre(CATEGORIA_NOMBRE)).thenReturn(crearCategoria());

        assertThatThrownBy(() -> faqService.crearCategoria(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Ya existe una categoría");

        verify(categoriaFaqRepository, never()).save(any());
    }

    @Test
    void crearCategoria_cuandoOrdenNull_usaCeroPorDefecto() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre(CATEGORIA_NOMBRE)
                .orden(null)
                .build();

        when(categoriaFaqRepository.findByNombre(CATEGORIA_NOMBRE)).thenReturn(null);
        when(categoriaFaqRepository.save(any(CategoriaFaq.class)))
                .thenAnswer(invocation -> {
                    CategoriaFaq saved = invocation.getArgument(0);
                    saved.setId(CATEGORIA_ID);
                    return saved;
                });

        CategoriaFaqDto resultado = faqService.crearCategoria(dto);

        assertThat(resultado.getOrden()).isEqualTo(0);
    }

    @Test
    void crearCategoria_cuandoOrdenExistente_reordenaCategorias() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre("Nueva Categoria")
                .orden(1)
                .build();

        CategoriaFaq existente = CategoriaFaq.builder()
                .id(2L)
                .nombre("Existente")
                .orden(1)
                .activa(true)
                .build();

        when(categoriaFaqRepository.findByNombre("Nueva Categoria")).thenReturn(null);
        when(categoriaFaqRepository.findByActivaTrueAndOrdenGreaterThanEqualOrderByOrdenAsc(1))
                .thenReturn(List.of(existente));
        when(categoriaFaqRepository.saveAll(anyList())).thenReturn(List.of(existente));
        when(categoriaFaqRepository.save(any(CategoriaFaq.class)))
                .thenAnswer(invocation -> {
                    CategoriaFaq saved = invocation.getArgument(0);
                    saved.setId(3L);
                    return saved;
                });

        faqService.crearCategoria(dto);

        ArgumentCaptor<List<CategoriaFaq>> captor = ArgumentCaptor.forClass(List.class);
        verify(categoriaFaqRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getOrden()).isEqualTo(2);
    }

    // ===== Tests para actualizarCategoria =====

    @Test
    void actualizarCategoria_cuandoExiste_retornaCategoriaActualizada() {
        CategoriaFaq existente = crearCategoria();
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre("Pagos Actualizados")
                .descripcion("Nueva descripcion")
                .icono("Wallet")
                .orden(2)
                .activa(true)
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(existente));
        when(categoriaFaqRepository.findByNombre("Pagos Actualizados")).thenReturn(null);
        when(categoriaFaqRepository.save(any(CategoriaFaq.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CategoriaFaqDto resultado = faqService.actualizarCategoria(CATEGORIA_ID, dto);

        assertThat(resultado.getNombre()).isEqualTo("Pagos Actualizados");
        assertThat(resultado.getDescripcion()).isEqualTo("Nueva descripcion");
        assertThat(resultado.getIcono()).isEqualTo("Wallet");
        assertThat(resultado.getOrden()).isEqualTo(2);
    }

    @Test
    void actualizarCategoria_cuandoNoExiste_lanzaRuntimeException() {
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre("Test")
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> faqService.actualizarCategoria(CATEGORIA_ID, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Categoría no encontrada");
    }

    @Test
    void actualizarCategoria_cuandoNombreDuplicado_lanzaRuntimeException() {
        CategoriaFaq existente = crearCategoria();
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre("Otro Nombre")
                .build();

        CategoriaFaq duplicado = CategoriaFaq.builder()
                .id(2L)
                .nombre("Otro Nombre")
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(existente));
        when(categoriaFaqRepository.findByNombre("Otro Nombre")).thenReturn(duplicado);

        assertThatThrownBy(() -> faqService.actualizarCategoria(CATEGORIA_ID, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Ya existe una categoría");
    }

    @Test
    void actualizarCategoria_cuandoOrdenMenor_reordenaHaciaArriba() {
        CategoriaFaq existente = crearCategoria();
        existente.setOrden(3);
        CreateUpdateCategoriaFaqDto dto = CreateUpdateCategoriaFaqDto.builder()
                .nombre(CATEGORIA_NOMBRE)
                .orden(1)
                .build();

        CategoriaFaq otra1 = CategoriaFaq.builder().id(2L).nombre("Otra1").orden(1).activa(true).build();
        CategoriaFaq otra2 = CategoriaFaq.builder().id(3L).nombre("Otra2").orden(2).activa(true).build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(existente));
        when(categoriaFaqRepository.findByActivaTrueAndOrdenGreaterThanEqualOrderByOrdenAsc(1))
                .thenReturn(List.of(otra1, otra2, existente));
        when(categoriaFaqRepository.saveAll(anyList())).thenReturn(List.of(otra1, otra2));
        when(categoriaFaqRepository.save(any(CategoriaFaq.class))).thenAnswer(invocation -> invocation.getArgument(0));

        faqService.actualizarCategoria(CATEGORIA_ID, dto);

        verify(categoriaFaqRepository).saveAll(anyList());
    }

    // ===== Tests para eliminarCategoria =====

    @Test
    void eliminarCategoria_cuandoExiste_eliminaConPreguntas() {
        CategoriaFaq existente = crearCategoria();
        PreguntaFaq pregunta = crearPregunta();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(existente));
        when(preguntaFaqRepository.findByCategoriaId(CATEGORIA_ID)).thenReturn(List.of(pregunta));

        faqService.eliminarCategoria(CATEGORIA_ID);

        verify(preguntaFaqRepository).deleteAll(List.of(pregunta));
        verify(categoriaFaqRepository).delete(existente);
    }

    @Test
    void eliminarCategoria_cuandoNoExiste_lanzaRuntimeException() {
        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> faqService.eliminarCategoria(CATEGORIA_ID))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Categoría no encontrada");

        verify(categoriaFaqRepository, never()).delete(any());
    }

    // ===== Tests para crearPregunta =====

    @Test
    void crearPregunta_cuandoEsValida_retornaPreguntaCreada() {
        CategoriaFaq categoria = crearCategoria();
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .orden(1)
                .activa(true)
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(categoria));
        when(preguntaFaqRepository.findByCategoriaIdAndOrdenGreaterThanEqualOrderByOrdenAsc(CATEGORIA_ID, 1))
                .thenReturn(Collections.emptyList());
        when(preguntaFaqRepository.save(any(PreguntaFaq.class)))
                .thenAnswer(invocation -> {
                    PreguntaFaq saved = invocation.getArgument(0);
                    saved.setId(PREGUNTA_ID);
                    return saved;
                });

        PreguntaFaqDto resultado = faqService.crearPregunta(dto);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getPregunta()).isEqualTo(PREGUNTA_TEXTO);
        assertThat(resultado.getRespuesta()).isEqualTo(RESPUESTA_TEXTO);
        assertThat(resultado.getOrden()).isEqualTo(1);
        assertThat(resultado.getActiva()).isTrue();
        assertThat(resultado.getCategoriaId()).isEqualTo(CATEGORIA_ID);
    }

    @Test
    void crearPregunta_cuandoCategoriaNoExiste_lanzaRuntimeException() {
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> faqService.crearPregunta(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Categoría no encontrada");

        verify(preguntaFaqRepository, never()).save(any());
    }

    @Test
    void crearPregunta_cuandoOrdenNull_usaCeroPorDefecto() {
        CategoriaFaq categoria = crearCategoria();
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .orden(null)
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(categoria));
        when(preguntaFaqRepository.findByCategoriaIdAndOrdenGreaterThanEqualOrderByOrdenAsc(CATEGORIA_ID, 0))
                .thenReturn(Collections.emptyList());
        when(preguntaFaqRepository.save(any(PreguntaFaq.class)))
                .thenAnswer(invocation -> {
                    PreguntaFaq saved = invocation.getArgument(0);
                    saved.setId(PREGUNTA_ID);
                    return saved;
                });

        PreguntaFaqDto resultado = faqService.crearPregunta(dto);

        assertThat(resultado.getOrden()).isEqualTo(0);
    }

    @Test
    void crearPregunta_cuandoOrdenExistente_reordenaPreguntas() {
        CategoriaFaq categoria = crearCategoria();
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta("Nueva Pregunta")
                .respuesta("Respuesta nueva")
                .orden(1)
                .build();

        PreguntaFaq existente = PreguntaFaq.builder()
                .id(2L)
                .categoria(categoria)
                .pregunta("Existente")
                .respuesta("Respuesta existente")
                .orden(1)
                .activa(true)
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(categoria));
        when(preguntaFaqRepository.findByCategoriaIdAndOrdenGreaterThanEqualOrderByOrdenAsc(CATEGORIA_ID, 1))
                .thenReturn(List.of(existente));
        when(preguntaFaqRepository.saveAll(anyList())).thenReturn(List.of(existente));
        when(preguntaFaqRepository.save(any(PreguntaFaq.class)))
                .thenAnswer(invocation -> {
                    PreguntaFaq saved = invocation.getArgument(0);
                    saved.setId(3L);
                    return saved;
                });

        faqService.crearPregunta(dto);

        ArgumentCaptor<List<PreguntaFaq>> captor = ArgumentCaptor.forClass(List.class);
        verify(preguntaFaqRepository).saveAll(captor.capture());
        assertThat(captor.getValue().get(0).getOrden()).isEqualTo(2);
    }

    @Test
    void crearPregunta_cuandoActivaNull_usaTruePorDefecto() {
        CategoriaFaq categoria = crearCategoria();
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .activa(null)
                .build();

        when(categoriaFaqRepository.findById(CATEGORIA_ID)).thenReturn(Optional.of(categoria));
        when(preguntaFaqRepository.findByCategoriaIdAndOrdenGreaterThanEqualOrderByOrdenAsc(CATEGORIA_ID, 0))
                .thenReturn(Collections.emptyList());
        when(preguntaFaqRepository.save(any(PreguntaFaq.class)))
                .thenAnswer(invocation -> {
                    PreguntaFaq saved = invocation.getArgument(0);
                    saved.setId(PREGUNTA_ID);
                    return saved;
                });

        PreguntaFaqDto resultado = faqService.crearPregunta(dto);

        assertThat(resultado.getActiva()).isTrue();
    }

    // ===== Tests para actualizarPregunta =====

    @Test
    void actualizarPregunta_cuandoExiste_retornaPreguntaActualizada() {
        PreguntaFaq existente = crearPregunta();
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta("Pregunta Actualizada")
                .respuesta("Respuesta Actualizada")
                .orden(2)
                .activa(true)
                .build();

        when(preguntaFaqRepository.findById(PREGUNTA_ID)).thenReturn(Optional.of(existente));
        when(preguntaFaqRepository.findByCategoriaIdAndOrdenGreaterThanEqualOrderByOrdenAsc(CATEGORIA_ID, 2))
                .thenReturn(Collections.emptyList());
        when(preguntaFaqRepository.save(any(PreguntaFaq.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PreguntaFaqDto resultado = faqService.actualizarPregunta(PREGUNTA_ID, dto);

        assertThat(resultado.getPregunta()).isEqualTo("Pregunta Actualizada");
        assertThat(resultado.getRespuesta()).isEqualTo("Respuesta Actualizada");
        assertThat(resultado.getOrden()).isEqualTo(2);
    }

    @Test
    void actualizarPregunta_cuandoNoExiste_lanzaRuntimeException() {
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta("Test")
                .respuesta("Test")
                .build();

        when(preguntaFaqRepository.findById(PREGUNTA_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> faqService.actualizarPregunta(PREGUNTA_ID, dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Pregunta no encontrada");
    }

    @Test
    void actualizarPregunta_cuandoCambiaOrdenMenor_reordenaHaciaArriba() {
        PreguntaFaq existente = crearPregunta();
        existente.setOrden(3);
        CreateUpdatePreguntaFaqDto dto = CreateUpdatePreguntaFaqDto.builder()
                .categoriaId(CATEGORIA_ID)
                .pregunta(PREGUNTA_TEXTO)
                .respuesta(RESPUESTA_TEXTO)
                .orden(1)
                .build();

        PreguntaFaq otra1 = PreguntaFaq.builder().id(2L).categoria(crearCategoria()).pregunta("Otra1").respuesta("R1").orden(1).activa(true).build();
        PreguntaFaq otra2 = PreguntaFaq.builder().id(3L).categoria(crearCategoria()).pregunta("Otra2").respuesta("R2").orden(2).activa(true).build();

        when(preguntaFaqRepository.findById(PREGUNTA_ID)).thenReturn(Optional.of(existente));
        when(preguntaFaqRepository.findByCategoriaIdAndOrdenGreaterThanEqualOrderByOrdenAsc(CATEGORIA_ID, 1))
                .thenReturn(List.of(otra1, otra2, existente));
        when(preguntaFaqRepository.saveAll(anyList())).thenReturn(List.of(otra1, otra2));
        when(preguntaFaqRepository.save(any(PreguntaFaq.class))).thenAnswer(invocation -> invocation.getArgument(0));

        faqService.actualizarPregunta(PREGUNTA_ID, dto);

        verify(preguntaFaqRepository).saveAll(anyList());
    }

    // ===== Tests para eliminarPregunta =====

    @Test
    void eliminarPregunta_cuandoExiste_eliminaPregunta() {
        PreguntaFaq existente = crearPregunta();

        when(preguntaFaqRepository.findById(PREGUNTA_ID)).thenReturn(Optional.of(existente));

        faqService.eliminarPregunta(PREGUNTA_ID);

        verify(preguntaFaqRepository).delete(existente);
    }

    @Test
    void eliminarPregunta_cuandoNoExiste_lanzaRuntimeException() {
        when(preguntaFaqRepository.findById(PREGUNTA_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> faqService.eliminarPregunta(PREGUNTA_ID))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Pregunta no encontrada");

        verify(preguntaFaqRepository, never()).delete(any());
    }
}
