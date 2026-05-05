package mx.sisati.sisatibackend.suscripcion;

import lombok.RequiredArgsConstructor;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.suscripcion.dto.CrearSuscripcionRequest;
import mx.sisati.sisatibackend.suscripcion.dto.SuscripcionDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuscripcionService {

    private final SuscripcionRepository suscripcionRepository;

    public SuscripcionService(SuscripcionRepository suscripcionRepository) {
        this.suscripcionRepository = suscripcionRepository;
    }

    @Transactional
    public SuscripcionDTO crearPlan(CrearSuscripcionRequest request) {
        if (suscripcionRepository.existsByNombreIgnoreCase(request.nombre())) {
            throw new ServiceException(Suscripcion.class, "NOMBRE_OCUPADO");
        }

        Suscripcion suscripcion = new Suscripcion(
            request.nombre(),
            request.precio(),
            request.cubiculosActivosPermitidos(),
            request.comisionPorcentaje(),
            request.descripcion()
        );

        suscripcion = suscripcionRepository.save(suscripcion);

        return SuscripcionDTO.fromEntity(suscripcion);
    }

    @Transactional(readOnly = true)
    public Suscripcion obtenerPlanPorId(Long id) {
        return suscripcionRepository.findById(id)
            .orElseThrow(() -> new ServiceException(this.getClass(), "NO_ENCONTRADO"));
    }

    @Transactional(readOnly = true)
    public List<SuscripcionDTO> obtenerTodosLosPlanes() {
        return suscripcionRepository.findAll()
            .stream()
            .map(SuscripcionDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SuscripcionDTO> obtenerPlanesOrdenadosPorPrecio() {
        return suscripcionRepository.findAllByOrderByPrecioAsc()
            .stream()
            .map(SuscripcionDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public SuscripcionDTO actualizarPlan(Long id, CrearSuscripcionRequest request) {
        Suscripcion suscripcion = suscripcionRepository.findById(id)
            .orElseThrow(() -> new ServiceException(this.getClass(),"NO_ENCONTRADO"));

        if (!suscripcion.getNombre().equalsIgnoreCase(request.nombre()) &&
            suscripcionRepository.existsByNombreIgnoreCase(request.nombre())) {
            throw new ServiceException(this.getClass(), "NOMBRE_OCUPADO");
        }

        suscripcion.actualizar(
            request.nombre(),
            request.precio(),
            request.cubiculosActivosPermitidos(),
            request.comisionPorcentaje(),
            request.descripcion()
        );

        suscripcion = suscripcionRepository.save(suscripcion);

        return SuscripcionDTO.fromEntity(suscripcion);
    }

    @Transactional
    public void eliminarPlan(Long id) {

        if (!suscripcionRepository.existsById(id)) {
            throw new ServiceException(this.getClass(),"NO_ENCONTRADO");
        }

        suscripcionRepository.deleteById(id);
    }
}
