package mx.sisati.sisatibackend.espacios.cubiculo.aplicacion;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.*;
import mx.sisati.sisatibackend.espacios.locations.Location;
import mx.sisati.sisatibackend.espacios.locations.LocationService;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GestionarCubiculos {

    private final CubiculoService cubiculoService;
    private final LocationService locationService;
    private final PropietarioService propietarioService;

    public GestionarCubiculos(CubiculoService cubiculoService, LocationService locationService, PropietarioService propietarioService) {
        this.cubiculoService = cubiculoService;
        this.locationService = locationService;
        this.propietarioService = propietarioService;
    }


    @Transactional
    public CubiculoCreateResponseDTO create(CubiculoCreateRequestDTO dto, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Location location = locationService.findByIdOrThrow(dto.locationId(), propietario);
        Cubiculo cubiculo = cubiculoService.createCubiculo(dto, location);

        return new CubiculoCreateResponseDTO(cubiculo, location.getId());
    }

    @Transactional
    public CubiculoUpdateResponseDTO update(
            Long cubiculoId,
            CubiculoUpdateRequestDTO dto,
            Long usuarioId
    ) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Cubiculo cubiculo = cubiculoService.updateCubiculo(cubiculoId, dto, propietario);
        return new CubiculoUpdateResponseDTO(cubiculo);
    }

    public List<CubiculoResponse> findCubiculosByLocation(Long locationId, Long id) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);
        Location location = locationService.findByIdOrThrow(locationId, propietario);
        List<Cubiculo> cubiculos = cubiculoService.findCubiculosByLocation(location);

        return cubiculos.stream()
                .map(c -> toResponse(c, location.getId()))
                .toList();
    }

    private CubiculoResponse toResponse(Cubiculo cubiculo, Long locationId) {
        List<CaracteristicaDTO> caracteristicasDTO = cubiculo.getCaracteristicas().stream()
                .map(caracteristica -> new CaracteristicaDTO(caracteristica.getId(), caracteristica.getNombre()))
                .toList();
        
        return new CubiculoResponse(
                cubiculo.getId(),
                locationId,
                cubiculo.getNombre(),
                cubiculo.getDescripcion(),
                cubiculo.getPrecio(),
                cubiculo.getImageUrl(),
                caracteristicasDTO,
                cubiculo.isActive()
        );
    }

    public List<CubiculoResponse> findActivedCubiculosByLocation(Long locationId, Long id) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);
        Location location = locationService.findByIdOrThrow(locationId, propietario);
        List<Cubiculo> cubiculos = cubiculoService.findActiveCubiculosByLocation(location, true);

        return cubiculos.stream()
                .map(c -> toResponse(c, location.getId()))
                .toList();
    }

    public void activateCubiculo(Long cubiculoId, Long id) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);
        cubiculoService.activateCubiculo(cubiculoId, propietario);
    }

    public void desactivateCubiculo(Long cubiculoId, Long id) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);

        cubiculoService.desactivateCubiculo(cubiculoId, propietario);
    }
}
