package mx.sisati.sisatibackend.finanzas.pagoSuscripcion;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.finanzas.pago.Moneda;
import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.PropietarioSuscripcion;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.PropietarioSuscripcionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PagoSuscripcionService {

    private final PagoSuscripcionRepository pagoSuscripcionRepository;
    private final Clock clock;

    public PagoSuscripcionService(PagoSuscripcionRepository pagoSuscripcionRepository,
                                  Clock clock) {
        this.pagoSuscripcionRepository = pagoSuscripcionRepository;
        this.clock = clock;
    }

    @Transactional
    public PagoResponse crearPagoParaSuscripcion(PropietarioSuscripcion propietarioSuscripcion, UUID propietarioSuscripcionId, int minutosExpiracion) {

        BigDecimal monto = propietarioSuscripcion.getSuscripcion().getPrecio();
        String nombrePlan = propietarioSuscripcion.getSuscripcion().getNombre();

        String descripcion = String.format(
                "Pago de suscripción - Plan %s",
                nombrePlan
        );

        LocalDateTime fechaExpiracion = LocalDateTime.now(clock).plusMinutes(minutosExpiracion);

        PagoSuscripcion pagoSuscripcion = new PagoSuscripcion(
                monto,
                Moneda.MXN,
                descripcion,
                fechaExpiracion,
                propietarioSuscripcion
        );

        PagoSuscripcion pagoGuardado = pagoSuscripcionRepository.save(pagoSuscripcion);

        return PagoResponse.fromEntity(pagoGuardado, LocalDateTime.now(clock));
    }

    @Transactional
    public List<PagoResponse> listarPagosDeSuscripcion(PropietarioSuscripcion propietarioSuscripcion, UUID propietarioSuscripcionId) {
        return pagoSuscripcionRepository.findByPropietarioSuscripcion(propietarioSuscripcion)
                .stream()
                .map(pago -> PagoResponse.fromEntity(pago, LocalDateTime.now(clock)))
                .collect(Collectors.toList());
    }
}