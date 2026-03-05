package mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.aplicacion;

import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import mx.sisati.sisatibackend.suscripcion.Suscripcion;
import mx.sisati.sisatibackend.suscripcion.SuscripcionService;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.PropietarioSuscripcion;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.PropietarioSuscripcionService;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.dto.ContratarSuscripcionRequest;
import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.dto.PropietarioSuscripcionDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;

@Service
public class GestionarSuscripciones {

    private final PropietarioSuscripcionService propietarioSuscripcionService;
    private final SuscripcionService suscripcionService;
    private final PropietarioService propietarioService;
    private final Clock clock;

    public GestionarSuscripciones(PropietarioSuscripcionService propietarioSuscripcionService, SuscripcionService suscripcionService, PropietarioService propietarioService, Clock clock) {
        this.propietarioSuscripcionService = propietarioSuscripcionService;
        this.suscripcionService = suscripcionService;
        this.propietarioService = propietarioService;
        this.clock = clock;
    }

    @Transactional
    public PropietarioSuscripcionDTO contratarSuscripcion(ContratarSuscripcionRequest request, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Suscripcion suscripcion = suscripcionService.obtenerPlanPorId(request.suscripcionId());
        if (propietarioSuscripcionService.tieneSuscripcionActiva(propietario.getId())) {
            throw new DomainException(this.getClass(), "PROPIETARIO_YA_TIENE_SUSCRIPCION");
        }
        PropietarioSuscripcion propietarioSuscripcion = propietarioSuscripcionService.contratarSuscripcion(propietario, suscripcion, request.autoRenovacion());
        return PropietarioSuscripcionDTO.fromEntity(propietarioSuscripcion, clock);
    }
}
