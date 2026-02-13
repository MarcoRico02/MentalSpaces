package mx.sisati.sisatibackend.agenda.reserva.aplicacion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.agenda.reserva.Reserva;
import mx.sisati.sisatibackend.agenda.reserva.ReservaService;
import mx.sisati.sisatibackend.agenda.reserva.dto.ReservaCreateRequestDTO;
import mx.sisati.sisatibackend.agenda.reserva.dto.ReservaCreateResponseDTO;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.disponibilidad.Disponibilidad;
import mx.sisati.sisatibackend.espacios.disponibilidad.DisponibilidadService;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.psicologos.PsicologoService;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GestionarReservas {
    private final CubiculoService cubiculoService;
    private final DisponibilidadService disponibilidadService;
    private final PsicologoService psicologoService;
    private final ReservaService reservaService;
    // private final PagosService pagosService; para recordar que lo tengo que hacer
    // private final ConfiguracionSistemaService configuracionSistemaService;
    private static final int TIEMPO_MINIMO_DE_ANTELACION_PARA_CANCELAR_EN_HORAS = 2;

    public GestionarReservas(CubiculoService cubiculoService, DisponibilidadService disponibilidadService, PsicologoService psicologoService, ReservaService reservaService) {
        this.cubiculoService = cubiculoService;
        this.disponibilidadService = disponibilidadService;
        this.psicologoService = psicologoService;
        this.reservaService = reservaService;
    }

    @Transactional
    public ReservaCreateResponseDTO create(ReservaCreateRequestDTO createDTO, Long usuarioId){
        //Psicologo
        Psicologo psicologo = psicologoService.getByUsuarioIdOrThrow(usuarioId);
        //Cubiculo
        Cubiculo cubiculo = cubiculoService.getByCubiculoIdOrThrow(createDTO.cubiculoId());

        if (!cubiculo.isActive())
            throw new ServiceException(this.getClass(), "CUBICULO_NO_DISPONIBLE");


        //Disponibilidad
        LocalDateTime inicio = createDTO.inicio();
        LocalDateTime fin = createDTO.fin();

        DayOfWeek dia = inicio.getDayOfWeek();

        List<Disponibilidad> disponibilidades =
                disponibilidadService.findDisponibilidadesByCubiculoAndDia(cubiculo.getId(), dia);

        if (disponibilidades.isEmpty()) {
            throw new ServiceException(this.getClass(), "CUBICULO_SIN_DISPONIBILIDAD_ESE_DIA");
        }
        boolean caeEnDisponibilidad = disponibilidades.stream().anyMatch(d ->
                !inicio.toLocalTime().isBefore(d.getHoraInicio()) &&
                        !fin.toLocalTime().isAfter(d.getHoraFin())
        );

        Disponibilidad disponibilidadValida = disponibilidades.stream()
                .filter(d ->
                        !inicio.toLocalTime().isBefore(d.getHoraInicio()) &&
                                !fin.toLocalTime().isAfter(d.getHoraFin())
                )
                .findFirst()
                .orElse(null);

        if (disponibilidadValida == null) {
            throw new ServiceException(this.getClass(), "RESERVA_FUERA_DE_HORARIO_DISPONIBLE");
        }

        if (!caeEnDisponibilidad) {
            throw new ServiceException(this.getClass(), "FUERA_DE_HORARIO_DISPONIBLE");
        }

        // Reserva
        Reserva reserva = reservaService.crearReserva(cubiculo, psicologo, inicio, fin, createDTO.notas());
        return  new ReservaCreateResponseDTO(reserva, cubiculo.getId());
    }
}
