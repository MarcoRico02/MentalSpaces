package mx.sisati.sisatibackend.reserva;

import jakarta.persistence.criteria.Predicate;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.reserva.dto.ReservaFilterRequestDTO;
import org.springframework.data.jpa.domain.Specification;
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
        // Hibernate/JDBC no infiere el tipo SQL de un parámetro cuando la
        // primera aparición de ese parámetro en la query es con IS NULL,
        // causando "could not determine data type of parameter $N".
        // Usamos Specifications para construir el WHERE dinámicamente,
        // omitiendo los filtros que vienen null y evitando el IS NULL.

        LocalDateTime ahora = LocalDateTime.now(clock);

        Specification<Reserva> spec = (root, query, cb) -> {
            // JOIN FETCH para evitar LazyInitializationException
            // al acceder a cubiculo y psicologo.usuario desde ReservaDTO.fromEntity
            root.fetch("cubiculo");
            root.fetch("psicologo").fetch("usuario");

            Predicate p = cb.conjunction();

            if (filtro.fechaInicio() != null)
                p = cb.and(p, cb.greaterThan(root.get("fin"), filtro.fechaInicio()));

            if (filtro.fechaFin() != null)
                p = cb.and(p, cb.lessThan(root.get("inicio"), filtro.fechaFin()));

            if (filtro.cubiculoIds() != null && !filtro.cubiculoIds().isEmpty())
                p = cb.and(p, root.get("cubiculo").get("id").in(filtro.cubiculoIds()));

            if (filtro.locationIds() != null && !filtro.locationIds().isEmpty())
                p = cb.and(p, root.get("cubiculo").get("location").get("id").in(filtro.locationIds()));

            if (filtro.usuarioIds() != null && !filtro.usuarioIds().isEmpty())
                p = cb.and(p, root.get("psicologo").get("usuario").get("id").in(filtro.usuarioIds()));

            if (filtro.filtroTemporal() != null) {
                if (filtro.filtroTemporal().equals("FUTURA"))
                    p = cb.and(p, cb.greaterThan(root.get("inicio"), cb.literal(ahora)));
                else if (filtro.filtroTemporal().equals("PASADA"))
                    p = cb.and(p, cb.lessThan(root.get("fin"), cb.literal(ahora)));
                else if (filtro.filtroTemporal().equals("CANCELADA"))
                    p = cb.and(p, cb.equal(root.get("estadoReserva"), EstadoReserva.CANCELADA));
            }

            query.orderBy(cb.asc(root.get("inicio")));
            return p;
        };

        return reservaRepository.findAll(spec);
    }
}
