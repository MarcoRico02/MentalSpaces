package mx.sisati.sisatibackend.reserva.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistemaService;
import mx.sisati.sisatibackend.configuracionSistema.TipoUso;
import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import mx.sisati.sisatibackend.finanzas.pagoReserva.PagoReservaService;
import mx.sisati.sisatibackend.reserva.Reserva;
import mx.sisati.sisatibackend.reserva.ReservaService;
import mx.sisati.sisatibackend.reserva.ReservaRepository;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateRequestDTO;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateResponseDTO;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.disponibilidad.DisponibilidadService;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import mx.sisati.sisatibackend.identidad.usuarios.UsuarioService;
import mx.sisati.sisatibackend.identidad.roles.RolNombre;
import mx.sisati.sisatibackend.finanzas.pago.PagoService;
import mx.sisati.sisatibackend.finanzas.pago.EstadoPago;
import mx.sisati.sisatibackend.finanzas.pago.dto.ActualizarEstadoPagoRequest;
import mx.sisati.sisatibackend.validador.reserva.creacion.ReservaValidadorCreacionService;
import org.springframework.stereotype.Service;

import java.util.List;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.reserva.dto.ReservaDTO;
import java.util.stream.Collectors;

@Service
public class GestionarReservas {
    private final CubiculoService cubiculoService;
    private final DisponibilidadService disponibilidadService;
    private final PsicologoService psicologoService;
    private final ReservaService reservaService;
    private final PagoReservaService pagoReservaService;
    private final ConfiguracionSistemaService configuracionSistemaService;
    private final PropietarioService propietarioService;
    private final UsuarioService usuarioService;
    private final ReservaRepository reservaRepository;
    private final PagoService pagoService;
    private final ReservaValidadorCreacionService reservaValidadorCreacionService;

    public GestionarReservas(
            CubiculoService cubiculoService,
            DisponibilidadService disponibilidadService,
            PsicologoService psicologoService,
            ReservaService reservaService,
            PagoReservaService pagoReservaService,
            ConfiguracionSistemaService configuracionSistemaService,
            PropietarioService propietarioService,
            UsuarioService usuarioService,
            ReservaRepository reservaRepository,
            PagoService pagoService,
            ReservaValidadorCreacionService reservaValidadorCreacionService
    ) {
        this.cubiculoService = cubiculoService;
        this.disponibilidadService = disponibilidadService;
        this.psicologoService = psicologoService;
        this.reservaService = reservaService;
        this.pagoReservaService = pagoReservaService;
        this.configuracionSistemaService = configuracionSistemaService;
        this.propietarioService = propietarioService;
        this.usuarioService = usuarioService;
        this.reservaRepository = reservaRepository;
        this.pagoService = pagoService;
        this.reservaValidadorCreacionService = reservaValidadorCreacionService;
    }

    @Transactional
    public ReservaCreateResponseDTO create(ReservaCreateRequestDTO createDTO, Long usuarioId){
        Psicologo psicologo = psicologoService.getByUsuarioIdOrThrow(usuarioId);
        pagoReservaService.validarSinPagosPendientes(psicologo);
        Cubiculo cubiculo = cubiculoService.getByCubiculoActiveIdOrThrow(createDTO.cubiculoId());
        disponibilidadService.validarReservaDentroDeDisponibilidad(createDTO.cubiculoId(), createDTO.inicio(), createDTO.fin());
        List<ConfiguracionSistema> configuracionesSistema = configuracionSistemaService.getConfiguracionPorTipo(TipoUso.RESERVA_CREACION);
        reservaValidadorCreacionService.validarReglasCreacion(configuracionesSistema, createDTO.inicio(), createDTO.fin());
        Reserva reserva = reservaService.crearReserva(cubiculo, psicologo, createDTO.inicio(), createDTO.fin(), createDTO.notas());
        PagoResponse pagoResponse = pagoReservaService.crearPagoParaReserva(reserva, 15);
        return new ReservaCreateResponseDTO(reserva, cubiculo, pagoResponse);
    }

    @Transactional
    public mx.sisati.sisatibackend.reserva.dto.ReservaCancelResponseDTO cancelar(Long reservaId, Long usuarioId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "RESERVA_NO_ENCONTRADA"));

        // Si el usuario es propietario del sistema (dueño), puede cancelar sin validación temporal
        if (propietarioService.getByUsuarioId(usuarioId).isPresent()) {
            // aplicar efectos sobre el pago si existe (penalización o cancelación) antes de cancelar la reserva
            String[] resultadoPago = procesarPagoEnCancelacion(reserva);
            reservaService.cancelarComoRolDueno(reserva);
            PagoResponse pago = null;
            try {
                pago = pagoReservaService.obtenerPagoPorReserva(reserva);
            } catch (ServiceException ignored) {}
            return new mx.sisati.sisatibackend.reserva.dto.ReservaCancelResponseDTO(reserva.getEstadoReserva(), pago, resultadoPago[0], resultadoPago[1]);
        }

        // Si el usuario es psicólogo, aplicar la validación de tiempo y luego cancelar
        if (psicologoService.getByUsuarioId(usuarioId).isPresent()) {
            // Solo puede cancelar si la reserva le pertenece
            if (reserva.getPsicologo() == null || !reserva.getPsicologo().getId().equals(usuarioId)) {
                throw new ServiceException(this.getClass(), "NO_TIENE_PERMISO_CANCELAR_RESERVA");
            }
            // aplicar efectos sobre el pago si existe antes de cancelar la reserva
            String[] resultadoPago = procesarPagoEnCancelacion(reserva);
            reserva.cancelar();
            reservaRepository.save(reserva);
            PagoResponse pago = null;
            try {
                pago = pagoReservaService.obtenerPagoPorReserva(reserva);
            } catch (ServiceException ignored) {}
            return new mx.sisati.sisatibackend.reserva.dto.ReservaCancelResponseDTO(reserva.getEstadoReserva(), pago, resultadoPago[0], resultadoPago[1]);
        }

        // Si es admin, permitir también la cancelación
        try {
            var usuario = usuarioService.findById(usuarioId);
            boolean esAdmin = usuario.getRoles().stream().anyMatch(r -> r.getNombre() == RolNombre.ADMIN);
            if (esAdmin) {
                String[] resultadoPago = procesarPagoEnCancelacion(reserva);
                reservaService.cancelarComoRolDueno(reserva);
                PagoResponse pago = null;
                try {
                    pago = pagoReservaService.obtenerPagoPorReserva(reserva);
                } catch (ServiceException ignored) {}
                return new mx.sisati.sisatibackend.reserva.dto.ReservaCancelResponseDTO(reserva.getEstadoReserva(), pago, resultadoPago[0], resultadoPago[1]);
            }
        } catch (ServiceException ignored) {
            // usuario no encontrado -> seguirá al final con permiso denegado
        }

        throw new ServiceException(this.getClass(), "NO_TIENE_PERMISO_CANCELAR_RESERVA");
    }

    private String[] procesarPagoEnCancelacion(Reserva reserva) {
        try {
            PagoResponse pago = pagoReservaService.obtenerPagoPorReserva(reserva);
            if (pago == null) return new String[]{null, null};

            // Si el pago puede reembolsarse (está PAGADO), lo marcamos como REEMBOLSADO
            if (Boolean.TRUE.equals(pago.puedeReembolsarse())) {
                pagoService.actualizarEstado(pago.id(), new ActualizarEstadoPagoRequest(EstadoPago.REEMBOLSADO, null, "Reembolso por cancelación de reserva"));
                return new String[]{"REEMBOLSADO", "Se ha iniciado el reembolso del pago asociado."};
            }

            // Si el pago puede cancelarse (pendiente), lo cancelamos
            if (Boolean.TRUE.equals(pago.puedeCancelar())) {
                pagoService.cancelarPago(pago.id(), "Cancelación de reserva");
                return new String[]{"CANCELADO", "El pago pendiente ha sido cancelado."};
            }

            return new String[]{null, null};
        } catch (ServiceException ignored) {
            // no existe pago o error al obtenerlo; retornamos nulos para indicar que no hubo acción
            return new String[]{null, null};
        }
    }

    @Transactional
    public java.util.List<ReservaDTO> listarReservasPorUsuario(Long usuarioId) {
        // Intentamos encontrar reservas para el usuario si es psicólogo
        var psicologoOpt = psicologoService.getByUsuarioId(usuarioId);
        if (psicologoOpt.isPresent()) {
            var psicologo = psicologoOpt.get();
            var reservas = reservaRepository.findByPsicologoIdOrderByInicioDesc(psicologo.getId());
            return reservas.stream().map(ReservaDTO::fromEntity).collect(Collectors.toList());
        }
        // Si no es psicólogo, devolver lista vacía (puedes extender para admins/propietarios)
        return java.util.Collections.emptyList();
    }
}
