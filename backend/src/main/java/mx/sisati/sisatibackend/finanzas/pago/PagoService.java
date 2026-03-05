package mx.sisati.sisatibackend.finanzas.pago;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.finanzas.pago.dto.ActualizarEstadoPagoRequest;
import mx.sisati.sisatibackend.finanzas.pago.dto.CrearPagoRequest;
import mx.sisati.sisatibackend.finanzas.pago.dto.PagoResponse;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final Clock clock;
    public PagoService(PagoRepository pagoRepository, Clock clock) {
        this.pagoRepository = pagoRepository;
        this.clock = clock;
    }

    @Transactional
    public PagoResponse crearPago(CrearPagoRequest request) {

        // Crear entidad
        Pago pago = new Pago(
                request.monto(),
                request.moneda(),
                request.descripcion(),
                LocalDateTime.now(clock).plusMinutes(request.minutosExpiracion())
        );

        Pago pagoGuardado = pagoRepository.save(pago);

        return PagoResponse.fromEntity(pagoGuardado, LocalDateTime.now(clock));
    }

    @Transactional
    public PagoResponse obtenerPorId(UUID id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new ServiceException(this.getClass(), "NOT_FOUND"));
        return PagoResponse.fromEntity(pago, LocalDateTime.now(clock));
    }

    @Transactional
    public List<PagoResponse> listarTodos() {

        return pagoRepository.findAll().stream()
                .map(pago -> {return PagoResponse.fromEntity(pago, LocalDateTime.now(clock));})
                .collect(Collectors.toList());
    }

    @Transactional
    public List<PagoResponse> listarPorEstado(EstadoPago estado) {
        return pagoRepository.findByEstado(estado).stream()
                .map(pago -> {return PagoResponse.fromEntity(pago, LocalDateTime.now(clock));})
                .collect(Collectors.toList());
    }


    @Transactional
    public PagoResponse actualizarEstado(UUID id, ActualizarEstadoPagoRequest request) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new ServiceException(this.getClass(), "PAGO_NO_ENCONTRADO"));

        switch (request.nuevoEstado()) {
                case PROCESANDO -> pago.marcarComoProcesando();
                case PAGADO -> pago.marcarComoPagado(request.stripePaymentIntentId());
                case EXPIRADO -> pago.marcarComoExpirado();
                case CANCELADO -> pago.cancelar();
                case REEMBOLSADO -> pago.marcarComoReembolsado();
                case FALLIDO -> pago.marcarComoFallido();
                default -> throw new ServiceException(this.getClass(),"ESTADO_INVALIDO");
        }

            Pago pagoActualizado = pagoRepository.save(pago);
            return PagoResponse.fromEntity(pagoActualizado, LocalDateTime.now(clock));
    }

    @Transactional
    public void confirmarPago(UUID id, String stripePaymentIntentId) {
        ActualizarEstadoPagoRequest request = new ActualizarEstadoPagoRequest(
                EstadoPago.PAGADO,
                stripePaymentIntentId,
                null
        );
        actualizarEstado(id, request);
    }

    @Transactional
    public void cancelarPago(UUID id, String motivo) {
        ActualizarEstadoPagoRequest request = new ActualizarEstadoPagoRequest(
                EstadoPago.CANCELADO,
                null,
                motivo
        );
        actualizarEstado(id, request);
    }

    @Transactional
    public int expirarPagosPendientes() {
        List<Pago> pagosExpirados = pagoRepository.findPagosExpirados();
        pagosExpirados.forEach(Pago::marcarComoExpirado);
        pagoRepository.saveAll(pagosExpirados);
        return pagosExpirados.size();
    }
}