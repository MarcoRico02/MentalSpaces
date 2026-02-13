package mx.sisati.sisatibackend.agenda.reserva;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final Clock clock;
    private static final int HORAS_MINIMAS_ANTICIPACION = 2;
    private static final int DIAS_MAXIMOS_ANTICIPACION = 30;

    public ReservaService(ReservaRepository reservaRepository, Clock clock) {
        this.reservaRepository = reservaRepository;
        this.clock = clock;
    }

    public Reserva crearReserva(Cubiculo cubiculo, Psicologo psicologo, LocalDateTime inicio, LocalDateTime fin, String notas) {

        LocalDateTime now = LocalDateTime.now(clock);
        if (inicio.isBefore(now))
            throw new ServiceException(Reserva.class, "RESERVAR_EN_DIAS_ANTERIORES_NO_ESTA_PERMITIDO");

        LocalDateTime limiteMinimo = now.plusHours(HORAS_MINIMAS_ANTICIPACION);
        if (inicio.isBefore(limiteMinimo))
            throw new ServiceException(Reserva.class, "HORAS_MINIMAS_DE_ANTICIPACION_NO_RESPETADAS");


        boolean existeSolapamiento = reservaRepository.existeSolapamiento(cubiculo.getId(), inicio, fin);
        if (existeSolapamiento)
            throw new ServiceException(Reserva.class, "EXISTE_SOLAPAMIENTO");


        LocalDateTime limiteMaximo = now.plusDays(DIAS_MAXIMOS_ANTICIPACION);
        if (inicio.isAfter(limiteMaximo))
            throw new ServiceException(Reserva.class, "BOOKING_TOO_FAR_IN_ADVANCE");
        Reserva reserva = new Reserva(cubiculo, psicologo, inicio, fin, notas);
        return reservaRepository.save(reserva);
    }
}
