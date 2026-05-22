package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.reserva.dto.ReservaFilterRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.Clock;
import java.time.LocalDateTime;

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

    public List<Reserva> buscarReservasPorFiltros(ReservaFilterRequestDTO filtro) {
        return reservaRepository.buscarPorFiltros(
                filtro.fechaInicio(),
                filtro.fechaFin(),
                filtro.cubiculoIds(),
                filtro.locationIds(),
                filtro.usuarioIds(),
                filtro.filtroTemporal()
        );
    }
}
