package mx.sisati.sisatibackend.reserva.reagendamiento;

import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.reserva.Reserva;
import mx.sisati.sisatibackend.reserva.reagendamiento.dto.CrearSolicitudReagendamientoRequestDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitudReagendamientoServiceTest {

    @Mock
    private SolicitudReagendamientoRepository solicitudReagendamientoRepository;

    @InjectMocks
    private SolicitudReagendamientoService solicitudReagendamientoService;

    private static final Long RESERVA_ID = 1L;
    private static final LocalDateTime INICIO = LocalDateTime.of(2026, 6, 1, 10, 0);
    private static final LocalDateTime FIN = LocalDateTime.of(2026, 6, 1, 12, 0);
    private static final String MOTIVO = "Motivo de prueba";

    @Test
    void crearSolicitudReagendamiento_cuandoNoExistePendiente_creaSolicitudCorrectamente() {
        Reserva reserva = mock(Reserva.class);
        when(reserva.getId()).thenReturn(RESERVA_ID);

        CrearSolicitudReagendamientoRequestDTO request = new CrearSolicitudReagendamientoRequestDTO(
                RESERVA_ID, INICIO, FIN, MOTIVO);

        when(solicitudReagendamientoRepository.existsByReservaIdAndEstadoSolicitud(
                RESERVA_ID, EstadoSolicitudReagendamiento.PENDIENTE)).thenReturn(false);
        when(solicitudReagendamientoRepository.save(any(SolicitudReagendamiento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SolicitudReagendamiento result = solicitudReagendamientoService
                .crearSolicitudReagendamiento(reserva, request);

        ArgumentCaptor<SolicitudReagendamiento> captor = ArgumentCaptor.forClass(SolicitudReagendamiento.class);
        verify(solicitudReagendamientoRepository).save(captor.capture());
        SolicitudReagendamiento saved = captor.getValue();

        assertThat(saved.getReserva()).isEqualTo(reserva);
        assertThat(saved.getInicio()).isEqualTo(INICIO);
        assertThat(saved.getFin()).isEqualTo(FIN);
        assertThat(saved.getMotivo()).isEqualTo(MOTIVO);
        assertThat(saved.getEstadoSolicitud()).isEqualTo(EstadoSolicitudReagendamiento.PENDIENTE);
        assertThat(result).isSameAs(saved);
    }

    @Test
    void crearSolicitudReagendamiento_cuandoExistePendiente_lanzaServiceException() {
        Reserva reserva = mock(Reserva.class);
        when(reserva.getId()).thenReturn(RESERVA_ID);

        CrearSolicitudReagendamientoRequestDTO request = new CrearSolicitudReagendamientoRequestDTO(
                RESERVA_ID, INICIO, FIN, MOTIVO);

        when(solicitudReagendamientoRepository.existsByReservaIdAndEstadoSolicitud(
                RESERVA_ID, EstadoSolicitudReagendamiento.PENDIENTE)).thenReturn(true);

        assertThatThrownBy(() ->
                solicitudReagendamientoService.crearSolicitudReagendamiento(reserva, request)
        )
                .isInstanceOf(ServiceException.class)
                .hasMessage("YA_EXISTE_SOLICITUD_PENDIENTE");

        verify(solicitudReagendamientoRepository, never()).save(any());
    }
}
