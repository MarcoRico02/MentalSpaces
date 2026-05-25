package mx.sisati.sisatibackend.reserva;

import jakarta.persistence.criteria.Predicate;
import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.reserva.dto.ReservaFilterRequestDTO;
import org.springframework.data.jpa.domain.Specification;
import mx.sisati.sisatibackend.identidad.usuarios.Usuario;
import mx.sisati.sisatibackend.reserva.dto.FiltroTemporal;
import mx.sisati.sisatibackend.reserva.dto.ReservaConsultaResponseDTO;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistemaService;
import mx.sisati.sisatibackend.configuracionSistema.TipoUso;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.time.Duration;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final Clock clock;
    private final ConfiguracionSistemaService configuracionSistemaService;

    public ReservaService(ReservaRepository reservaRepository, Clock clock, ConfiguracionSistemaService configuracionSistemaService) {
        this.reservaRepository = reservaRepository;
        this.clock = clock;
        this.configuracionSistemaService = configuracionSistemaService;
    }

    public Reserva getByIdOrThrow(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new ServiceException(Reserva.class, "RESERVA_NO_ENCONTRADA"));
    }

    public Reserva getByIdAndPsicologoOrThrow(Long reservaId, Long psicologoId) {
        Reserva reserva = getByIdOrThrow(reservaId);
        if (!reserva.getPsicologo().getId().equals(psicologoId))
            throw new ServiceException(Reserva.class, "RESERVA_NO_PERTENECE_AL_PSICOLOGO");
        return reserva;
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

    public ReservaConsultaResponseDTO getReservas(Usuario usuario) {
        List<Reserva> reservasPropias = reservaRepository.findByPsicologoId(usuario.getId());
        List<Reserva> reservasEnMisCubiculos = reservaRepository.findByPropietarioId(usuario.getId());
        return ReservaConsultaResponseDTO.fromEntity(reservasPropias, reservasEnMisCubiculos);
    }

    public ReservaConsultaResponseDTO getReservas(Usuario usuario, FiltroTemporal filtro) {
        LocalDateTime now = LocalDateTime.now(clock);
        List<Reserva> reservasPropias;
        List<Reserva> reservasEnMisCubiculos = switch (filtro) {
            case FUTURA -> {
                reservasPropias = reservaRepository.findFuturasByPsicologoId(usuario.getId(), now);
                yield reservaRepository.findFuturasByPropietarioId(usuario.getId(), now);
            }
            case PASADA -> {
                reservasPropias = reservaRepository.findPasadasByPsicologoId(usuario.getId(), now);
                yield reservaRepository.findPasadasByPropietarioId(usuario.getId(), now);
            }
            case CANCELADA -> {
                reservasPropias = reservaRepository.findByPsicologoIdAndEstadoReserva(usuario.getId(), EstadoReserva.CANCELADA);
                yield reservaRepository.findReservasByPropietarioIdAndEstado(usuario.getId(), EstadoReserva.CANCELADA);
            }
            default -> throw new ServiceException(this.getClass(), "FILTRO_NO_SOPORTADO");
        };

        return ReservaConsultaResponseDTO.fromEntity(reservasPropias, reservasEnMisCubiculos);
    }

    /**
     * Valida cancelación por rol psicólogo usando la configuración TipoUso.RESERVA_CANCELACION.
     * Si la diferencia entre inicio de la reserva y el momento actual es menor al límite de horas
     * (configurado o 6 horas por defecto) lanza ServiceException con código CANCELACION_PROHIBIDA_HORARIO.
     */
    public void cancelarComoRolPsicologo(Reserva reserva) {
        // Intentamos obtener la configuración por TipoUso.RESERVA_CANCELACION (si existe),
        // aunque la regla de negocio actual exige 6 horas mínimas para permitir cancelaciones.
        // TODO: Les dije que NINGUN service puede usar otro service, mas que los de aplicacion que son orquestadores de servicio

        List<ConfiguracionSistema> configs = configuracionSistemaService.getConfiguracionPorTipo(TipoUso.RESERVA_CANCELACION);

        // Determinamos el límite de horas a usar; por defecto 6 horas si no hay configuración.
        // TODO: Esta logica de "horas por defecto" minimo las hubias dejado en el configuracionSistemaService
        //  (bueno, va en validador/reserva/cancelacion), aqui no tiene nada que ver
        long horasLimite = 6L;
        if (configs != null && !configs.isEmpty()) {
            ConfiguracionSistema cfg = configs.get(0);
            if (cfg.getValorMinimo() != null) {
                horasLimite = Math.max(6L, cfg.getValorMinimo());
            } else if (cfg.getValorMaximo() != null) {
                horasLimite = Math.max(6L, cfg.getValorMaximo());
            }
        }
        // TODO: no se si te diste cuenta como esta implemenado la validacion de configuracion del sistema, pero hay una carpeta que se llama:
        //  validadaor/reserva/creacion... osea, ASI deberias validarlos, no dentro del service directamente, mira el servicio de la reserva, la creacion
        LocalDateTime ahora = LocalDateTime.now(clock);
        Duration tiempoRestante = Duration.between(ahora, reserva.getInicio());
        long horasDisponibles = tiempoRestante.toHours();

        if (horasDisponibles < horasLimite) {
            throw new ServiceException(this.getClass(), "CANCELACION_PROHIBIDA_HORARIO");
        }
    }

    /**
     * Permite al dueño cancelar cualquier reserva sin validación de tiempo.
     * Realiza la transición de estado mediante la entidad y persiste el cambio.
     */
    public void cancelarComoRolDueno(Reserva reserva) {
        // La entidad valida estados no permitidos (por ejemplo FINALIZADA o ya CANCELADA)
        // TODO: Ah, por sus huevos JAJAJA
        reserva.cancelar();
        reservaRepository.save(reserva);
    }
}
