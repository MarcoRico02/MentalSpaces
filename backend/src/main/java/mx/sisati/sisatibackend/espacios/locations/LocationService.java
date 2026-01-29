package mx.sisati.sisatibackend.espacios.locations;

import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationCreateRequestDTO;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    public final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location saveLocation(LocationCreateRequestDTO locationCreateRequestDTO, Propietario propietario){
        Location location = new Location(locationCreateRequestDTO.name(), locationCreateRequestDTO.description(), locationCreateRequestDTO.address(), locationCreateRequestDTO.latitude(), locationCreateRequestDTO.longitude(), propietario);
        locationRepository.save(location);
        return location;
    }

    public Location updateLocation(
            Long locationId,
            LocationCreateRequestDTO dto,
            Propietario propietario
    ) {
        Location location = locationRepository
                .findByIdAndPropietarioId(locationId, propietario.getId())
                .orElseThrow(() ->
                        new ServiceException(this.getClass(), "Locación no encontrada o no pertenece al propietario")
                );

        location.update(
                dto.name(),
                dto.description(),
                dto.address(),
                dto.latitude(),
                dto.longitude()
        );

        return locationRepository.save(location);
    }

    public Location deactivateLocation(Long locationId, Propietario propietario) {
        Location location = locationRepository
                .findByIdAndPropietarioId(locationId, propietario.getId())
                .orElseThrow(() ->
                        new ServiceException(this.getClass(), "Locación no encontrada o no pertenece al propietario")
                );

        location.desactivateLocation();
        locationRepository.save(location);
        return location;
    }

    public List<Location> findByPropietario(Propietario propietario) {
        return locationRepository.findByPropietarioId(propietario.getId());
    }

    public List<Location> findByPropietarioAndActive(Propietario propietario) {
        return locationRepository.findByPropietarioIdAndActiveTrue(propietario.getId());
    }

    public Location findByIdOrThrow(Long locationId, Propietario propietario) {
        return locationRepository
                .findByIdAndPropietarioId(locationId, propietario.getId())
                .orElseThrow(() ->
                        new ServiceException(this.getClass(), "Locación no encontrada o no pertenece al propietario")
                );
    }

    public void activateLocation(Long locationId, Propietario propietario) {
        Location location = locationRepository
                .findByIdAndPropietarioId(locationId, propietario.getId())
                .orElseThrow(() ->
                        new ServiceException(this.getClass(), "Locación no encontrada o no pertenece al propietario")
                );

        location.activateLocation();
        locationRepository.save(location);
    }
}