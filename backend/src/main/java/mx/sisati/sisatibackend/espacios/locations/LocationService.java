package mx.sisati.sisatibackend.espacios.locations;

import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationCreateRequestDTO;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        location.setImageUrl(locationCreateRequestDTO.imageUrl());
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
                dto.longitude(),
                dto.imageUrl()
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

    public Page<Location> findByPropietario(Propietario propietario, Pageable pageable) {
        return locationRepository.findByPropietarioId(propietario.getId(), pageable);
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

    public List<Location> findAllActive() {
        return locationRepository.findByActiveTrue();
    }

    public Location findByIdOrThrow(Long locationId) {
        return locationRepository.findById(locationId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "Locación no encontrada"));
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