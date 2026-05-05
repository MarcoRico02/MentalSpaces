package mx.sisati.sisatibackend.finanzas.pagoReserva;

import jakarta.transaction.Transactional;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.finanzas.pago.EstadoPago;
import mx.sisati.sisatibackend.finanzas.pago.Moneda;
import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;
import mx.sisati.sisatibackend.reserva.Reserva;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoReservaService {

    private final PagoReservaRepository pagoReservaRepository;
    private final Clock clock;

    public PagoReservaService(PagoReservaRepository pagoReservaRepository,
                              Clock clock) {
        this.pagoReservaRepository = pagoReservaRepository;
        this.clock = clock;
    }

    @Transactional
    public PagoResponse crearPagoParaReserva(Reserva reserva, int minutosExpiracion) {
        // 2. Verificar que no tenga pago
        if (pagoReservaRepository.existsByReserva(reserva)) {
            throw new ServiceException(this.getClass(), "RESERVA_YA_TIENE_PAGO");
        }

        // 3. Calcular monto
        BigDecimal precioPorHora = reserva.getCubiculo().getPrecio();
        long minutos = Duration.between(reserva.getInicio(), reserva.getFin()).toMinutes();
        BigDecimal monto = precioPorHora
                .multiply(BigDecimal.valueOf(minutos))
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);


        // 4. Crear descripción
        String descripcion = String.format(
                "Reserva %s - %d minutos",
                reserva.getCubiculo().getNombre(),
                minutos
        );

        // 5. Crear pago
        LocalDateTime fechaExpiracion = LocalDateTime.now(clock).plusMinutes(minutosExpiracion);

        PagoReserva pagoReserva = new PagoReserva(
                monto,
                Moneda.MXN,
                descripcion,
                fechaExpiracion,
                reserva
        );

        PagoReserva pagoGuardado = pagoReservaRepository.save(pagoReserva);

        return PagoResponse.fromEntity(pagoGuardado, LocalDateTime.now(clock));
    }

    @Transactional
    public PagoResponse obtenerPagoPorReserva(Reserva reserva) {

        PagoReserva pago = pagoReservaRepository.findByReserva(reserva)
                .orElseThrow(() -> new ServiceException(this.getClass(), "PAGO_NO_ENCONTRADO"));

        return PagoResponse.fromEntity(pago, LocalDateTime.now(clock));
    }

    @Transactional
    public List<PagoResponse> listarPagosPorPsicologo(Psicologo psicologo) {
        List<PagoReserva> pagos = pagoReservaRepository.findAllByDeudor(psicologo);

        return pagos.stream()
                .map(pago -> PagoResponse.fromEntity(pago, LocalDateTime.now(clock)))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<PagoResponse> listarPagosPendientesPorPsicologo(Psicologo psicologo) {
        List<PagoReserva> pagos = pagoReservaRepository
                .findByDeudorAndEstado(psicologo, EstadoPago.PENDIENTE);

        return pagos.stream()
                .map(pago -> PagoResponse.fromEntity(pago, LocalDateTime.now(clock)))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean tienePagosPendientes(Psicologo psicologo) {
        return pagoReservaRepository.existsPagosPendientesByDeudor(psicologo);
    }

    @Transactional
    public void validarSinPagosPendientes(Psicologo psicologo) {
        if (tienePagosPendientes(psicologo)) {
            throw new ServiceException(this.getClass(), "PSICOLOGO_TIENE_PAGOS_PENDIENTES");
        }
    }
}