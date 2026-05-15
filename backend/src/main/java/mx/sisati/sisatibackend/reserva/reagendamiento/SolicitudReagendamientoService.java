package mx.sisati.sisatibackend.reserva.reagendamiento;

import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.reserva.Reserva;
import mx.sisati.sisatibackend.reserva.reagendamiento.dto.CrearSolicitudReagendamientoRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class SolicitudReagendamientoService {

    private final SolicitudReagendamientoRepository solicitudReagendamientoRepository;

    public SolicitudReagendamientoService(SolicitudReagendamientoRepository solicitudReagendamientoRepository) {
        this.solicitudReagendamientoRepository = solicitudReagendamientoRepository;
    }

    public SolicitudReagendamiento crearSolicitudReagendamiento(Reserva reserva, CrearSolicitudReagendamientoRequestDTO request) {
        boolean existePendiente = solicitudReagendamientoRepository
                .existsByReservaIdAndEstadoSolicitud(reserva.getId(), EstadoSolicitudReagendamiento.PENDIENTE);
        if (existePendiente)
            throw new ServiceException(this.getClass(), "YA_EXISTE_SOLICITUD_PENDIENTE");

        SolicitudReagendamiento solicitud = new SolicitudReagendamiento(reserva, request.inicio(), request.fin(), request.motivo());
        return solicitudReagendamientoRepository.save(solicitud);
    }
}
