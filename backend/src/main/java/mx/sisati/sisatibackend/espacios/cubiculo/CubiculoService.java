package mx.sisati.sisatibackend.espacios.cubiculo;

import mx.sisati.sisatibackend.espacios.caracteristicas.Caracteristica;
import mx.sisati.sisatibackend.espacios.caracteristicas.CaracteristicaRepository;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.CubiculoCreateRequestDTO;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.CubiculoUpdateRequestDTO;
import mx.sisati.sisatibackend.espacios.locations.Location;
import mx.sisati.sisatibackend.espacios.locations.LocationService;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CubiculoService {

    private final CubiculoRepository cubiculoRepository;
    private final CaracteristicaRepository caracteristicaRepository;

    public CubiculoService(CubiculoRepository cubiculoRepository, CaracteristicaRepository caracteristicaRepository) {
        this.cubiculoRepository = cubiculoRepository;
        this.caracteristicaRepository = caracteristicaRepository;
    }

    public Cubiculo createCubiculo(CubiculoCreateRequestDTO dto, Location location) {
        if (!location.isActive()) {
            throw new ServiceException(this.getClass(), "No se puede crear un cubículo en una location inactiva");
        }

        Set<Caracteristica> caracteristicas = dto.caracteristicasIds() != null 
                ? dto.caracteristicasIds().stream()
                        .map(id -> caracteristicaRepository.findById(id)
                                .orElseThrow(() -> new ServiceException(this.getClass(), "Característica no encontrada con ID: " + id)))
                        .collect(Collectors.toSet())
                : Set.of();

        Cubiculo cubiculo = new Cubiculo(
                location,
                dto.nombre(),
                dto.descripcion(),
                dto.precio(),
                dto.imageUrl(),
                caracteristicas
        );

        return cubiculoRepository.save(cubiculo);
    }

    public Cubiculo updateCubiculo(Long cubiculoId, CubiculoUpdateRequestDTO dto, Propietario propietario) {
        Cubiculo cubiculo = findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);

        Set<Caracteristica> caracteristicas = dto.caracteristicasIds() != null 
                ? dto.caracteristicasIds().stream()
                        .map(id -> caracteristicaRepository.findById(id)
                                .orElseThrow(() -> new ServiceException(this.getClass(), "Característica no encontrada con ID: " + id)))
                        .collect(Collectors.toSet())
                : cubiculo.getCaracteristicas();

        cubiculo.update(
                dto.nombre(),
                dto.descripcion(),
                dto.precio(),
                dto.imageUrl(),
                caracteristicas
        );

        return cubiculoRepository.save(cubiculo);
    }

    public void activateCubiculo(Long cubiculoId, Propietario propietario) {
        Cubiculo cubiculo = findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);

        if (!cubiculo.getLocation().isActive()) {
            throw new ServiceException(this.getClass(), "No se puede activar un cubículo si su location está inactiva");
        }

        cubiculo.activate();
        cubiculoRepository.save(cubiculo);
    }

    public void desactivateCubiculo(Long cubiculoId, Propietario propietario) {
        Cubiculo cubiculo = findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);
        cubiculo.deactivate();
        cubiculoRepository.save(cubiculo);
    }

    public List<Cubiculo> findCubiculosByLocation(Location location) {
        return cubiculoRepository.findByLocation(location);
    }

    public List<Cubiculo> findActiveCubiculosByLocation(Location location, boolean active) {
        return cubiculoRepository.findByLocationIdAndActive(location.getId(), active);
    }

    public Cubiculo findCubiculoByIdAndValidateOwnership(Long cubiculoId, Propietario propietario) {
        Cubiculo cubiculo = cubiculoRepository.findById(cubiculoId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "Cubículo no encontrado"));

        if (!cubiculo.getLocation().getPropietario().getId().equals(propietario.getId())) {
            throw new ServiceException(this.getClass(), "El cubículo no pertenece al propietario autenticado");
        }

        return cubiculo;
    }

    public void deactivateAllCubiculosByLocation(Location location) {
        List<Cubiculo> cubiculos = cubiculoRepository.findByLocation(location);
        
        for (Cubiculo cubiculo : cubiculos) {
            if (cubiculo.isActive()) {
                cubiculo.deactivate();
            }
        }
        
        cubiculoRepository.saveAll(cubiculos);
    }

    public Location getLocationByCubiculoIdOrThrow(Long cubiculoId) {
        return cubiculoRepository.findById(cubiculoId)
                .map(Cubiculo::getLocation)
                .orElseThrow(() -> new ServiceException(this.getClass(), "No se encontró la locación para el cubículo"));
    }
}