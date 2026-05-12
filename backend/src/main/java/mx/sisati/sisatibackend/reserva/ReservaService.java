package mx.sisati.sisatibackend.reserva;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistemaService;
import mx.sisati.sisatibackend.configuracionSistema.TipoUso;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;

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

    /**
     * Valida cancelación por rol psicólogo usando la configuración TipoUso.RESERVA_CANCELACION.
     * Si la diferencia entre inicio de la reserva y el momento actual es menor al límite de horas
     * (configurado o 6 horas por defecto) lanza ServiceException con código CANCELACION_PROHIBIDA_HORARIO.
     */
    public void cancelarComoRolPsicologo(Reserva reserva) {
        // Intentamos obtener la configuración por TipoUso.RESERVA_CANCELACION (si existe),
        // aunque la regla de negocio actual exige 6 horas mínimas para permitir cancelaciones.
        List<ConfiguracionSistema> configs = configuracionSistemaService.getConfiguracionPorTipo(TipoUso.RESERVA_CANCELACION);

        // Determinamos el límite de horas a usar; por defecto 6 horas si no hay configuración.
        long horasLimite = 6L;
        if (configs != null && !configs.isEmpty()) {
            ConfiguracionSistema cfg = configs.get(0);
            if (cfg.getValorMinimo() != null) {
                horasLimite = Math.max(6L, cfg.getValorMinimo());
            } else if (cfg.getValorMaximo() != null) {
                horasLimite = Math.max(6L, cfg.getValorMaximo());
            }
        }

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
        reserva.cancelar();
        reservaRepository.save(reserva);
    }
}
