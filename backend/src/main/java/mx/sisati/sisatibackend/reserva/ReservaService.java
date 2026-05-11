package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.reserva.dto.FiltroTemporal;
import mx.sisati.sisatibackend.reserva.dto.ReservaConsultaResponseDTO;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final Clock clock;


    public ReservaService(ReservaRepository reservaRepository, Clock clock) {
        this.reservaRepository = reservaRepository;
        this.clock = clock;
    }

    public Reserva crearReserva(Cubiculo cubiculo, Psicologo psicologo, LocalDateTime inicio, LocalDateTime fin, String notas) {
        LocalDateTime now = LocalDateTime.now(clock);
        if (inicio.isBefore(now))
            throw new ServiceException(Reserva.class, "RESERVAR_EN_DIAS_ANTERIORES_NO_ESTA_PERMITIDO");

        boolean existeSolapamiento = reservaRepository.existeSolapamiento(cubiculo.getId(), inicio, fin);
        if (existeSolapamiento)
            throw new ServiceException(Reserva.class, "EXISTE_SOLAPAMIENTO");

        Reserva reserva = new Reserva(cubiculo, psicologo, inicio, fin, notas);
        return reservaRepository.save(reserva);
    }

    public ReservaConsultaResponseDTO getReservas(Usuario usuario) {
        List<Reserva> reservasPropias = reservaRepository.findByPsicologoId(usuario.getId());
        List<Reserva> reservasEnMisCubiculos = reservaRepository.findByPropietarioId(usuario.getId());
        return ReservaConsultaResponseDTO.fromEntity(reservasPropias, reservasEnMisCubiculos);
    }

    public ReservaConsultaResponseDTO getReservas(Usuario usuario, FiltroTemporal filtro) {
        LocalDateTime now = LocalDateTime.now(clock);
        List<Reserva> reservasPropias;
        List<Reserva> reservasEnMisCubiculos;

        switch (filtro) {
            case FUTURA:
                reservasPropias = reservaRepository.findFuturasByPsicologoId(usuario.getId(), now);
                reservasEnMisCubiculos = reservaRepository.findFuturasByPropietarioId(usuario.getId(), now);
                break;
            case PASADA:
                reservasPropias = reservaRepository.findPasadasByPsicologoId(usuario.getId(), now);
                reservasEnMisCubiculos = reservaRepository.findPasadasByPropietarioId(usuario.getId(), now);
                break;
            case CANCELADA:
                reservasPropias = reservaRepository.findByPsicologoIdAndEstadoReserva(usuario.getId(), EstadoReserva.CANCELADA);
                reservasEnMisCubiculos = reservaRepository.findReservasByPropietarioIdAndEstado(usuario.getId(), EstadoReserva.CANCELADA);
                break;
            default:
                throw new ServiceException(this.getClass(), "FILTRO_NO_SOPORTADO");
        }

        return ReservaConsultaResponseDTO.fromEntity(reservasPropias, reservasEnMisCubiculos);
    }
}
