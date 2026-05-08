package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private Clock clock;

    @Mock
    private Cubiculo cubiculo;

    @Mock
    private Psicologo psicologo;

    @InjectMocks
    private ReservaService reservaService;

    private static final Long CUBICULO_ID = 1L;
    private static final LocalDateTime INICIO = LocalDateTime.of(2026, 5, 7, 10, 0);
    private static final LocalDateTime FIN = LocalDateTime.of(2026, 5, 7, 12, 0);
    private static final String NOTAS = "Sesión de terapia semanal";

    @Test
    void crearReserva_cuandoEsValida_retornaReservaConDatosCorrectos() {
        when(cubiculo.getId()).thenReturn(CUBICULO_ID);

        Clock fixed = Clock.fixed(
                LocalDateTime.of(2026, 5, 7, 8, 0).toInstant(ZoneOffset.UTC),
                ZoneOffset.UTC
        );
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        when(reservaRepository.existeSolapamiento(CUBICULO_ID, INICIO, FIN)).thenReturn(false);
        when(reservaRepository.save(any(Reserva.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Reserva result = reservaService.crearReserva(cubiculo, psicologo, INICIO, FIN, NOTAS);

        ArgumentCaptor<Reserva> captor = ArgumentCaptor.forClass(Reserva.class);
        verify(reservaRepository).save(captor.capture());
        Reserva saved = captor.getValue();

        assertThat(saved.getCubiculo()).isEqualTo(cubiculo);
        assertThat(saved.getPsicologo()).isEqualTo(psicologo);
        assertThat(saved.getInicio()).isEqualTo(INICIO);
        assertThat(saved.getFin()).isEqualTo(FIN);
        assertThat(saved.getNotas()).isEqualTo(NOTAS);
        assertThat(saved.getEstadoReserva()).isEqualTo(EstadoReserva.PENDIENTE);
        assertThat(result).isSameAs(saved);
    }

    @Test
    void crearReserva_cuandoFechaEsPasada_lanzaServiceException() {
        Clock fixed = Clock.fixed(
                LocalDateTime.of(2026, 5, 7, 11, 0).toInstant(ZoneOffset.UTC),
                ZoneOffset.UTC
        );
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        assertThatThrownBy(() ->
                reservaService.crearReserva(cubiculo, psicologo, INICIO, FIN, NOTAS)
        )
                .isInstanceOf(ServiceException.class)
                .hasMessage("RESERVAR_EN_DIAS_ANTERIORES_NO_ESTA_PERMITIDO");

        verify(reservaRepository, never()).save(any());
    }

    @Test
    void crearReserva_cuandoExisteSolapamiento_lanzaServiceException() {
        when(cubiculo.getId()).thenReturn(CUBICULO_ID);

        Clock fixed = Clock.fixed(
                LocalDateTime.of(2026, 5, 7, 8, 0).toInstant(ZoneOffset.UTC),
                ZoneOffset.UTC
        );
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        when(reservaRepository.existeSolapamiento(CUBICULO_ID, INICIO, FIN)).thenReturn(true);

        assertThatThrownBy(() ->
                reservaService.crearReserva(cubiculo, psicologo, INICIO, FIN, NOTAS)
        )
                .isInstanceOf(ServiceException.class)
                .hasMessage("EXISTE_SOLAPAMIENTO");

        verify(reservaRepository, never()).save(any());
    }
}
