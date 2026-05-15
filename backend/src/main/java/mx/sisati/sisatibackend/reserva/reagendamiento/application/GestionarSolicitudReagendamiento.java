package mx.sisati.sisatibackend.reserva.reagendamiento.application;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistemaService;
import mx.sisati.sisatibackend.configuracionSistema.TipoUso;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.disponibilidad.DisponibilidadService;
import mx.sisati.sisatibackend.reserva.EstadoReserva;
import mx.sisati.sisatibackend.reserva.Reserva;
import mx.sisati.sisatibackend.reserva.ReservaService;
import mx.sisati.sisatibackend.reserva.reagendamiento.SolicitudReagendamiento;
import mx.sisati.sisatibackend.reserva.reagendamiento.SolicitudReagendamientoService;
import mx.sisati.sisatibackend.reserva.reagendamiento.dto.CrearSolicitudReagendamientoRequestDTO;
import mx.sisati.sisatibackend.reserva.reagendamiento.dto.SolicitudReagendamientoResponseDTO;
import mx.sisati.sisatibackend.validador.reserva.reagendamiento.ReservaValidadorReagendamientoService;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GestionarSolicitudReagendamiento {

    private final PsicologoService psicologoService;
    private final ReservaService reservaService;
    private final DisponibilidadService disponibilidadService;
    private final CubiculoService cubiculoService;
    private final ConfiguracionSistemaService configuracionSistemaService;
    private final ReservaValidadorReagendamientoService reservaValidadorReagendamientoService;
    private final SolicitudReagendamientoService solicitudReagendamientoService;
    private final Clock clock;

    public GestionarSolicitudReagendamiento(PsicologoService psicologoService, ReservaService reservaService,
                                            DisponibilidadService disponibilidadService,
                                            CubiculoService cubiculoService,
                                            ConfiguracionSistemaService configuracionSistemaService,
                                            ReservaValidadorReagendamientoService reservaValidadorReagendamientoService,
                                            SolicitudReagendamientoService solicitudReagendamientoService,
                                            Clock clock) {
        this.psicologoService = psicologoService;
        this.reservaService = reservaService;
        this.disponibilidadService = disponibilidadService;
        this.cubiculoService = cubiculoService;
        this.configuracionSistemaService = configuracionSistemaService;
        this.reservaValidadorReagendamientoService = reservaValidadorReagendamientoService;
        this.solicitudReagendamientoService = solicitudReagendamientoService;
        this.clock = clock;
    }

    @Transactional
    public SolicitudReagendamientoResponseDTO crear(CrearSolicitudReagendamientoRequestDTO request, Long usuarioId) {
        Psicologo psicologo = psicologoService.getByUsuarioIdOrThrow(usuarioId);
        Reserva reserva = reservaService.getByIdAndPsicologoOrThrow(request.idReserva(), psicologo.getId());

        if (reserva.getEstadoReserva() == EstadoReserva.RECHAZADO
                || reserva.getEstadoReserva() == EstadoReserva.CANCELADA
                || reserva.getEstadoReserva() == EstadoReserva.FINALIZADA)
            throw new ServiceException(this.getClass(), "RESERVA_NO_ACTIVA");

        Cubiculo cubiculo = cubiculoService.getByCubiculoActiveIdOrThrow(reserva.getCubiculo().getId());
        disponibilidadService.validarReservaDentroDeDisponibilidad(cubiculo.getId(), request.inicio(), request.fin());
        List<ConfiguracionSistema> configuraciones = configuracionSistemaService.getConfiguracionPorTipo(TipoUso.RESERVA_REAGENDAMIENTO);
        reservaValidadorReagendamientoService.validarReglasReagendamiento(configuraciones, request.inicio(), request.fin(), LocalDateTime.now(clock));

        SolicitudReagendamiento solicitud = solicitudReagendamientoService.crearSolicitudReagendamiento(reserva, request);
        return SolicitudReagendamientoResponseDTO.fromEntity(solicitud);
    }
}
