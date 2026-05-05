package mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion;

import lombok.RequiredArgsConstructor;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.suscripcion.Suscripcion;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.dto.PropietarioSuscripcionDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropietarioSuscripcionService {

    private final PropietarioSuscripcionRepository propietarioSuscripcionRepository;
    private final Clock clock;

    public PropietarioSuscripcionService(PropietarioSuscripcionRepository propietarioSuscripcionRepository, Clock clock) {
        this.propietarioSuscripcionRepository = propietarioSuscripcionRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public PropietarioSuscripcionDTO obtenerSuscripcionActiva(Long propietarioId) {
        PropietarioSuscripcion suscripcion = propietarioSuscripcionRepository
                .findActivaByPropietarioId(propietarioId, LocalDateTime.now(clock))
                .orElseThrow(() -> new ServiceException(this.getClass(), "PROPIETARIO_SIN_SUSCRIPCION_ACTIVA"));
        return PropietarioSuscripcionDTO.fromEntity(suscripcion, clock);
    }

    @Transactional(readOnly = true)
    public List<PropietarioSuscripcionDTO> obtenerHistorialSuscripciones(Long propietarioId) {
        return propietarioSuscripcionRepository.findByPropietarioIdOrderByFechaInicioDesc(propietarioId)
                .stream()
                .map(ps -> PropietarioSuscripcionDTO.fromEntity(ps, clock))
                .collect(Collectors.toList());
    }

    @Transactional
    public PropietarioSuscripcionDTO activarAutoRenovacion(Long suscripcionId) {
        PropietarioSuscripcion suscripcion = propietarioSuscripcionRepository.findById(suscripcionId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "SUSCRIPCION_NO_ENCONTRADA"));

        suscripcion.activarAutoRenovacion(LocalDateTime.now(clock));
        suscripcion = propietarioSuscripcionRepository.save(suscripcion);

        return PropietarioSuscripcionDTO.fromEntity(suscripcion, clock);
    }

    @Transactional
    public PropietarioSuscripcionDTO desactivarAutoRenovacion(Long suscripcionId) {
        PropietarioSuscripcion suscripcion = propietarioSuscripcionRepository.findById(suscripcionId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "SUSCRIPCION_NO_ENCONTRADA"));

        suscripcion.desactivarAutoRenovacion();
        suscripcion = propietarioSuscripcionRepository.save(suscripcion);

        return PropietarioSuscripcionDTO.fromEntity(suscripcion, clock);
    }

    @Transactional(readOnly = true)
    public boolean puedeTenerMasCubiculos(Long propietarioId, int cubiculosActuales) {
        return propietarioSuscripcionRepository
                .findActivaByPropietarioId(propietarioId, LocalDateTime.now(clock))
                .map(s -> {
                    return s.puedeTenerMasCubiculos(cubiculosActuales, LocalDateTime.now(clock));
                })
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public int cubiculosRestantes(Long propietarioId, int cubiculosActuales) {
        return propietarioSuscripcionRepository
                .findActivaByPropietarioId(propietarioId, LocalDateTime.now(clock))
                .map(s -> s.cubiculosRestantes(cubiculosActuales,LocalDateTime.now(clock)))
                .orElse(0);
    }

    @Transactional(readOnly = true)
    public List<PropietarioSuscripcionDTO> obtenerSuscripcionesParaRenovar(int diasAntes) {
        LocalDateTime inicio = LocalDateTime.now(clock);
        LocalDateTime fin = inicio.plusDays(diasAntes);

        return propietarioSuscripcionRepository.findSuscripcionesParaRenovar(inicio, fin)
                .stream()
                .map(ps -> PropietarioSuscripcionDTO.fromEntity(ps, clock))
                .collect(Collectors.toList());
    }

    @Transactional
    public void procesarRenovacionesAutomaticas() {
        LocalDateTime ahora = LocalDateTime.now(clock);
        LocalDateTime manana = ahora.plusDays(1);

        List<PropietarioSuscripcion> suscripcionesParaRenovar =
                propietarioSuscripcionRepository.findSuscripcionesParaRenovar(ahora, manana);

        for (PropietarioSuscripcion suscripcion : suscripcionesParaRenovar) {
            //TODO: Marco R: Integración con Stripe
            // Aquí irá la integración con Stripe para procesar el pago
            // Si el pago es exitoso, crear nueva suscripción

            PropietarioSuscripcion nuevaSuscripcion = new PropietarioSuscripcion(
                    suscripcion.getPropietario(),
                    suscripcion.getSuscripcion(),
                    true,
                    LocalDateTime.now(clock)
            );
            propietarioSuscripcionRepository.save(nuevaSuscripcion);
        }
    }

    public boolean tieneSuscripcionActiva(Long propietarioId) {
        return propietarioSuscripcionRepository.tieneSuscripcionActiva(propietarioId, LocalDateTime.now(clock));
    }

    public PropietarioSuscripcion contratarSuscripcion(Propietario propietario, Suscripcion suscripcion,
                                                       Boolean renovacionAutomatica) {
        PropietarioSuscripcion propietarioSuscripcion = new PropietarioSuscripcion(
                propietario,
                suscripcion,
                renovacionAutomatica,
                LocalDateTime.now(clock)
        );
        propietarioSuscripcion = propietarioSuscripcionRepository.save(propietarioSuscripcion);
        return propietarioSuscripcion;
    }
}