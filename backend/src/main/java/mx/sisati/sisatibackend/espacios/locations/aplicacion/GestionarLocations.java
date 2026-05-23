package mx.sisati.sisatibackend.espacios.locations.aplicacion;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.locations.Location;
import org.springframework.transaction.annotation.Transactional;
import mx.sisati.sisatibackend.espacios.locations.LocationService;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationCreateRequestDTO;
import mx.sisati.sisatibackend.espacios.locations.dto.LocationResponseDTO;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GestionarLocations {

    private final LocationService locationService;
    private final PropietarioService propietarioService;
    private final CubiculoService cubiculoService;

    public GestionarLocations(LocationService locationService, PropietarioService propietarioService, CubiculoService cubiculoService) {
        this.locationService = locationService;
        this.propietarioService = propietarioService;
        this.cubiculoService = cubiculoService;
    }

    @Transactional
    public LocationResponseDTO create(LocationCreateRequestDTO dto, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Location location = locationService.saveLocation(dto, propietario);
        return toResponseDTO(location);
    }

    @Transactional
    public LocationResponseDTO update(
            Long locationId,
            LocationCreateRequestDTO dto,
            Long usuarioId
    ) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Location location = locationService.updateLocation(locationId, dto, propietario);
        return toResponseDTO(location);
    }

    @Transactional
    public void desactivate(Long locationId, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Location location = locationService.deactivateLocation(locationId, propietario);
        cubiculoService.deactivateAllCubiculosByLocation(location);
    }

    @Transactional
    public void activate(Long locationId, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        locationService.activateLocation(locationId, propietario);
    }

    @Transactional(readOnly = true)
    public Page<LocationResponseDTO> findByPropietario(Long usuarioId, Pageable pageable) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        return locationService.findByPropietario(propietario, pageable)
                .map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<LocationResponseDTO> findByPropietarioAndActive(Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        return locationService.findByPropietarioAndActive(propietario)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LocationResponseDTO> findAllActive() {
        return locationService.findAllActive()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private LocationResponseDTO toResponseDTO(Location location) {
        return new LocationResponseDTO(
                location.getId(),
                location.getName(),
                location.getDescription(),
                location.getAddress(),
                location.getLatitude(),
                location.getLongitude(),
                location.isActive(),
                location.getImageUrl()
        );
    }

    public LocationResponseDTO findById(Long locationId, Long propietarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(propietarioId);
        Location location = locationService.findByIdOrThrow(locationId, propietario);
        return toResponseDTO(location);
    }
}