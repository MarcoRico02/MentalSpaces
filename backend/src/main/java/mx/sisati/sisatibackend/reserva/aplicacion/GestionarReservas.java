package mx.sisati.sisatibackend.reserva.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistemaService;
import mx.sisati.sisatibackend.configuracionSistema.TipoUso;
import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import mx.sisati.sisatibackend.finanzas.pagoReserva.PagoReservaService;
import mx.sisati.sisatibackend.reserva.Reserva;
import mx.sisati.sisatibackend.reserva.ReservaService;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateRequestDTO;
import mx.sisati.sisatibackend.reserva.dto.ReservaCreateResponseDTO;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.disponibilidad.DisponibilidadService;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import mx.sisati.sisatibackend.reserva.dto.ReservaDTO;
import mx.sisati.sisatibackend.validador.reserva.creacion.ReservaValidadorCreacionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GestionarReservas {
    private final CubiculoService cubiculoService;
    private final DisponibilidadService disponibilidadService;
    private final PsicologoService psicologoService;
    private final ReservaService reservaService;
    private final PagoReservaService pagoReservaService;
    private final ConfiguracionSistemaService configuracionSistemaService;
    private final ReservaValidadorCreacionService reservaValidadorCreacionService;

    public GestionarReservas(CubiculoService cubiculoService, DisponibilidadService disponibilidadService, PsicologoService psicologoService, ReservaService reservaService, PagoReservaService pagoReservaService, ConfiguracionSistemaService configuracionSistemaService, ReservaValidadorCreacionService reservaValidadorCreacionService) {
        this.cubiculoService = cubiculoService;
        this.disponibilidadService = disponibilidadService;
        this.psicologoService = psicologoService;
        this.reservaService = reservaService;
        this.pagoReservaService = pagoReservaService;
        this.configuracionSistemaService = configuracionSistemaService;
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

    /* Sin terminar
    public List<ReservaDTO> getReservasCalendario(
            ReservaCalendarioReadRequestDTO readDto,
            LocalDateTime inicio,
            LocalDateTime fin,
            List<Long> cubiculoIds,
            List<Long> locationIds
    ) {
        List<Reserva> reservas = reservaService.buscarPorFiltros(inicio, fin, cubiculoIds, locationIds);
        return reservas.stream().map(ReservaDTO::new).toList();
    }
     */
}
