package mx.sisati.sisatibackend.reserva.aplicacion;

import org.springframework.transaction.annotation.Transactional;
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
import mx.sisati.sisatibackend.reserva.dto.ReservaFilterRequestDTO;
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
import mx.sisati.sisatibackend.reserva.dto.ReservaDTO;
import mx.sisati.sisatibackend.validador.reserva.creacion.ReservaValidadorCreacionService;
import org.springframework.stereotype.Service;

import java.util.List;
import mx.sisati.sisatibackend.excepciones.ServiceException;

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

    public List<ReservaDTO> getReservas(ReservaFilterRequestDTO filtro) {
        List<Reserva> reservas = reservaService.buscarReservasPorFiltros(filtro);
        return reservas.stream().map(ReservaDTO::fromEntity).toList();
    }

    //@Transactional
    // TODO: ESTO ESTA MUY MAL (El noRollBackFor = Exception.class), PERO CUANDO EL CONTROLLER FALLO, YA NO QUISO RESPONDER ESTA COSA XD, ESTA HORRIBLE

    public mx.sisati.sisatibackend.reserva.dto.ReservaCancelResponseDTO cancelar(Long reservaId, Long usuarioId) {
        // TODO: GESTIONARRESERVAS es solo un orquestador... la logica debe de vivir en los servicios, mira el metodo de arriba
        //  si te fijas, no hay logica pesada, NADA, asi debio haber sido tu metodo

        // TODO: ESTA CLASE NO DEBERIA USAR "reservaRepository" directamente, revervaService tiene un metodo que se llama
        //  reservaService.getByIdAndPsicologoOrThrow(int, el literal lo que escribiste abajo)

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "RESERVA_NO_ENCONTRADA"));

        // Si el usuario es propietario del sistema (dueño), puede cancelar sin validación temporal
        // TODO: Intuyes que "Propietario" es el DUEÑO del sistema, no el dueño del cubiculo
        //  por que puede cancelar cuando quiera?
        //  el propietario puede cancelar las reservas de cualquier psicologo o propietario, segun esto, no valida que sea de un consultorio suyo
        if (propietarioService.getByUsuarioId(usuarioId).isPresent()) {
            // aplicar efectos sobre el pago si existe (penalización o cancelación) antes de cancelar la reserva
            String[] resultadoPago = procesarPagoEnCancelacion(reserva);
            reservaService.cancelarComoRolDueno(reserva);
            PagoResponse pago = null;
            // TODO: Les dije que no usaran NINGUN try catch, ya hay uno global
            try {
                pago = pagoReservaService.obtenerPagoPorReserva(reserva);
            } catch (ServiceException ignored) {}
            // TODO: El metodo espera un pagoResponse... y le mandaste un pago directamente xd, no creo que jale para empezar, no se como no tronó
            //  todo: No es obligatorio, pero estaría bien un método estatico que se llame "fromEntity", siguiendo la convención de los otros DTOs
            return new mx.sisati.sisatibackend.reserva.dto.ReservaCancelResponseDTO(reserva.getEstadoReserva(), pago, resultadoPago[0], resultadoPago[1]);
        }
        // TODO: Si entendi lo que hiciste arriba (solo en el if), si el que cancelo en dueño, cancela o rembolsa,

        // Si el usuario es psicólogo, aplicar la validación de tiempo y luego cancelar
        if (psicologoService.getByUsuarioId(usuarioId).isPresent()) {
            // Solo puede cancelar si la reserva le pertenece
            // TODO: justo para esto existe reservaService.getByIdAndPsicologoOrThrow(int), valida que la reserva le perterezca al psicologo
            if (reserva.getPsicologo() == null || !reserva.getPsicologo().getId().equals(usuarioId)) {
                throw new ServiceException(this.getClass(), "NO_TIENE_PERMISO_CANCELAR_RESERVA");
            }
            // aplicar efectos sobre el pago si existe antes de cancelar la reserva
            String[] resultadoPago = procesarPagoEnCancelacion(reserva);
            // VALIDACIÓN CONFIGURABLE: delegar a reservaService la verificación de ventana horaria
            // TODO: notas dentro del metodo
            reservaService.cancelarComoRolPsicologo(reserva);

            // proceder a cambiar el estado en la entidad y persistir
            // TODO: me explota una neurona ver el repository aqui, en vez del service, un metodo cancelar dentro del service, o algo xd
            reserva.cancelar();
            reservaRepository.save(reserva);
            PagoResponse pago = null;
            try {
                pago = pagoReservaService.obtenerPagoPorReserva(reserva);
            } catch (ServiceException ignored) {}
            // TODO: lee la nota de la linea 108, el otro return
            return new mx.sisati.sisatibackend.reserva.dto.ReservaCancelResponseDTO(reserva.getEstadoReserva(), pago, resultadoPago[0], resultadoPago[1]);
        }

        // Si es admin, permitir también la cancelación
        try {
            // TODO: TU CUANDO HAZ USADO VAR AKJSKASJ, ESTA FEO, PARA QUE QUIERE UN LENGUAJE DE TIPADO FUERTE PARA USAR UN VAR JASKJASKJ


            var usuario = usuarioService.findById(usuarioId);
            // TODO: para esto, mejor hubieras hecho un metodo en AdminService, mucho mas limpio
            //  asi como el PsicologoService.getByIdOrThrow, sabes?
            boolean esAdmin = usuario.getRoles().stream().anyMatch(r -> r.getNombre() == RolNombre.ADMIN);
            if (esAdmin) {
                String[] resultadoPago = procesarPagoEnCancelacion(reserva);
                // TODO: El administrador tiene el mismo poder que el propietario? ese propietario el dios
                reservaService.cancelarComoRolDueno(reserva);
                PagoResponse pago = null;

                // TODO: Este bloque lo repetiste en los 3 flujos... lo pudiste sacar en un metodo aparte se lo ibas a ocupar varias veces
                //  (Aunque este mal)
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
        // TODO: OTRO TRY-CATCH??
        try {
            PagoResponse pago = pagoReservaService.obtenerPagoPorReserva(reserva);
            if (pago == null) return new String[]{null, null};

            // Si el pago puede reembolsarse (está PAGADO), lo marcamos como REEMBOLSADO
            // TODO: ni supe que decirte
            if (Boolean.TRUE.equals(pago.puedeReembolsarse())) {
                pagoService.actualizarEstado(pago.id(), new ActualizarEstadoPagoRequest(EstadoPago.REEMBOLSADO, null, "Reembolso por cancelación de reserva"));
                // TODO: Te lo corregi en el DTO
                return new String[]{"REEMBOLSADO", "Se ha iniciado el reembolso del pago asociado."};
            }

            // Si el pago puede cancelarse (pendiente), lo cancelamos
            if (Boolean.TRUE.equals(pago.puedeCancelar())) {
                pagoService.cancelarPago(pago.id(), "Cancelación de reserva");
                // TODO: Te lo corregi en el DTO
                return new String[]{"CANCELADO", "El pago pendiente ha sido cancelado."};
            }

            return new String[]{null, null};
        } catch (ServiceException ignored) {
            // no existe pago o error al obtenerlo; retornamos nulos para indicar que no hubo acción
            return new String[]{null, null};
        }
    }
}
