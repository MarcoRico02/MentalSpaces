package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.reserva.dto.FiltroTemporal;
import mx.sisati.sisatibackend.reserva.dto.ReservaConsultaResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;

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

    @Mock
    private Usuario usuario;

    @InjectMocks
    private ReservaService reservaService;

    private static final Long CUBICULO_ID = 1L;
    private static final LocalDateTime INICIO = LocalDateTime.of(2026, 5, 7, 10, 0);
    private static final LocalDateTime FIN = LocalDateTime.of(2026, 5, 7, 12, 0);
    private static final String NOTAS = "Sesión de terapia semanal";
    private static final Long USUARIO_ID = 1L;
    private static final LocalDateTime NOW = LocalDateTime.of(2026, 5, 7, 8, 0);

    @BeforeEach
    void setUp() {
        when(psicologo.getUsuario()).thenReturn(usuario);
        when(usuario.getFullName()).thenReturn("Test Psychologist");
        when(cubiculo.getId()).thenReturn(CUBICULO_ID);
        when(cubiculo.getNombre()).thenReturn("Test Cubiculo");
        when(psicologo.getId()).thenReturn(1L);
    }

    private Reserva crearReserva(LocalDateTime inicio, LocalDateTime fin) {
        return new Reserva(cubiculo, psicologo, inicio, fin, NOTAS);
    }

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

    // ===== Tests para getReservas (US-GESCIT-004) =====

    @Test
    void getReservas_sinFiltro_cuandoPsicologoConReservas_retornaReservasPropias() {
        // CR1 - Consulta exitosa sin filtro como psicólogo
        when(usuario.getId()).thenReturn(USUARIO_ID);

        Reserva reserva = crearReserva(INICIO, FIN);
        when(reservaRepository.findByPsicologoId(USUARIO_ID)).thenReturn(List.of(reserva));
        when(reservaRepository.findByPropietarioId(USUARIO_ID)).thenReturn(Collections.emptyList());

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario);

        assertThat(response.reservasPropias()).hasSize(1);
        assertThat(response.reservasEnMisCubiculos()).isEmpty();
        verify(reservaRepository).findByPsicologoId(USUARIO_ID);
        verify(reservaRepository).findByPropietarioId(USUARIO_ID);
    }

    @Test
    void getReservas_sinFiltro_cuandoPropietarioConReservas_retornaReservasEnMisCubiculos() {
        // CR2 - Consulta exitosa sin filtro como propietario
        when(usuario.getId()).thenReturn(USUARIO_ID);

        Reserva reserva = crearReserva(INICIO, FIN);
        when(reservaRepository.findByPsicologoId(USUARIO_ID)).thenReturn(Collections.emptyList());
        when(reservaRepository.findByPropietarioId(USUARIO_ID)).thenReturn(List.of(reserva));

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario);

        assertThat(response.reservasPropias()).isEmpty();
        assertThat(response.reservasEnMisCubiculos()).hasSize(1);
        verify(reservaRepository).findByPsicologoId(USUARIO_ID);
        verify(reservaRepository).findByPropietarioId(USUARIO_ID);
    }

    @Test
    void getReservas_conFiltroFutura_retornaSoloFuturas() {
        // CR3 - Consulta de reservas futuras
        when(usuario.getId()).thenReturn(USUARIO_ID);
        Clock fixed = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        Reserva reserva = crearReserva(INICIO, FIN);
        when(reservaRepository.findFuturasByPsicologoId(USUARIO_ID, NOW)).thenReturn(List.of(reserva));
        when(reservaRepository.findFuturasByPropietarioId(USUARIO_ID, NOW)).thenReturn(Collections.emptyList());

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario, FiltroTemporal.FUTURA);

        assertThat(response.reservasPropias()).hasSize(1);
        assertThat(response.reservasEnMisCubiculos()).isEmpty();
        verify(reservaRepository).findFuturasByPsicologoId(USUARIO_ID, NOW);
        verify(reservaRepository).findFuturasByPropietarioId(USUARIO_ID, NOW);
    }

    @Test
    void getReservas_conFiltroFutura_usaMetodosFuturas() {
        // CR4 - Verifica interacción con repository (no valida JPQL real)
        // La exclusión de CANCELADA ocurre en el JPQL de findFuturasBy*
        when(usuario.getId()).thenReturn(USUARIO_ID);
        Clock fixed = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        when(reservaRepository.findFuturasByPsicologoId(USUARIO_ID, NOW)).thenReturn(Collections.emptyList());
        when(reservaRepository.findFuturasByPropietarioId(USUARIO_ID, NOW)).thenReturn(Collections.emptyList());

        reservaService.getReservas(usuario, FiltroTemporal.FUTURA);

        verify(reservaRepository).findFuturasByPsicologoId(USUARIO_ID, NOW);
        verify(reservaRepository).findFuturasByPropietarioId(USUARIO_ID, NOW);
    }

    @Test
    void getReservas_conFiltroPasada_retornaSoloPasadas() {
        // CR5 - Consulta de reservas pasadas
        when(usuario.getId()).thenReturn(USUARIO_ID);
        Clock fixed = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        Reserva reserva = crearReserva(NOW.minusHours(2), NOW.minusHours(1));
        when(reservaRepository.findPasadasByPsicologoId(USUARIO_ID, NOW)).thenReturn(List.of(reserva));
        when(reservaRepository.findPasadasByPropietarioId(USUARIO_ID, NOW)).thenReturn(Collections.emptyList());

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario, FiltroTemporal.PASADA);

        assertThat(response.reservasPropias()).hasSize(1);
        assertThat(response.reservasEnMisCubiculos()).isEmpty();
        verify(reservaRepository).findPasadasByPsicologoId(USUARIO_ID, NOW);
        verify(reservaRepository).findPasadasByPropietarioId(USUARIO_ID, NOW);
    }

    @Test
    void getReservas_conFiltroCancelada_retornaSoloCanceladas() {
        // CR6 - Consulta de reservas canceladas
        when(usuario.getId()).thenReturn(USUARIO_ID);
        Clock fixed = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        Reserva reserva = crearReserva(INICIO, FIN);
        when(reservaRepository.findByPsicologoIdAndEstadoReserva(USUARIO_ID, EstadoReserva.CANCELADA))
                .thenReturn(List.of(reserva));
        when(reservaRepository.findReservasByPropietarioIdAndEstado(USUARIO_ID, EstadoReserva.CANCELADA))
                .thenReturn(Collections.emptyList());

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario, FiltroTemporal.CANCELADA);

        assertThat(response.reservasPropias()).hasSize(1);
        assertThat(response.reservasEnMisCubiculos()).isEmpty();
        verify(reservaRepository).findByPsicologoIdAndEstadoReserva(USUARIO_ID, EstadoReserva.CANCELADA);
        verify(reservaRepository).findReservasByPropietarioIdAndEstado(USUARIO_ID, EstadoReserva.CANCELADA);
    }

    @Test
    void getReservas_sinFiltro_cuandoUsuarioSinReservas_retornaListasVacias() {
        // CR7 - Usuario sin reservas
        when(usuario.getId()).thenReturn(USUARIO_ID);

        when(reservaRepository.findByPsicologoId(USUARIO_ID)).thenReturn(Collections.emptyList());
        when(reservaRepository.findByPropietarioId(USUARIO_ID)).thenReturn(Collections.emptyList());

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario);

        assertThat(response.reservasPropias()).isEmpty();
        assertThat(response.reservasEnMisCubiculos()).isEmpty();
    }

    @Test
    void getReservas_conFiltroFutura_cuandoInicioIgualNow_noIncluye() {
        // CR15 - Validar inicio igual a now: la query JPQL usa inicio > now (estricto)
        when(usuario.getId()).thenReturn(USUARIO_ID);
        Clock fixed = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        Reserva reservaFutura = crearReserva(NOW.plusHours(2), NOW.plusHours(4));
        when(reservaRepository.findFuturasByPsicologoId(USUARIO_ID, NOW))
                .thenReturn(List.of(reservaFutura));
        when(reservaRepository.findFuturasByPropietarioId(USUARIO_ID, NOW))
                .thenReturn(Collections.emptyList());

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario, FiltroTemporal.FUTURA);

        assertThat(response.reservasPropias()).hasSize(1);
        assertThat(response.reservasEnMisCubiculos()).isEmpty();
        verify(reservaRepository).findFuturasByPsicologoId(USUARIO_ID, NOW);
    }

    @Test
    void getReservas_conFiltroPasada_cuandoFinIgualNow_noIncluye() {
        // CR16 - Validar fin igual a now: la query JPQL usa fin < now (estricto)
        when(usuario.getId()).thenReturn(USUARIO_ID);
        Clock fixed = Clock.fixed(NOW.toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
        when(clock.instant()).thenReturn(fixed.instant());
        when(clock.getZone()).thenReturn(fixed.getZone());

        Reserva reservaPasada = crearReserva(NOW.minusHours(2), NOW.minusHours(1));
        when(reservaRepository.findPasadasByPsicologoId(USUARIO_ID, NOW))
                .thenReturn(List.of(reservaPasada));
        when(reservaRepository.findPasadasByPropietarioId(USUARIO_ID, NOW))
                .thenReturn(Collections.emptyList());

        ReservaConsultaResponseDTO response = reservaService.getReservas(usuario, FiltroTemporal.PASADA);

        assertThat(response.reservasPropias()).hasSize(1);
        assertThat(response.reservasEnMisCubiculos()).isEmpty();
        verify(reservaRepository).findPasadasByPsicologoId(USUARIO_ID, NOW);
    }
}
