package mx.sisati.sisatibackend.espacios.cubiculo.aplicacion;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.*;
import mx.sisati.sisatibackend.espacios.disponibilidad.DisponibilidadService;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadCreateRequestDTO;
import mx.sisati.sisatibackend.espacios.locations.Location;
import mx.sisati.sisatibackend.espacios.locations.LocationService;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GestionarCubiculos {

    private final CubiculoService cubiculoService;
    private final LocationService locationService;
    private final PropietarioService propietarioService;
    private final DisponibilidadService disponibilidadService;

    public GestionarCubiculos(CubiculoService cubiculoService, LocationService locationService, PropietarioService propietarioService, DisponibilidadService disponibilidadService) {
        this.cubiculoService = cubiculoService;
        this.locationService = locationService;
        this.propietarioService = propietarioService;
        this.disponibilidadService = disponibilidadService;
    }


    @Transactional
    public CubiculoCreateResponseDTO create(CubiculoCreateRequestDTO dto, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Location location = locationService.findByIdOrThrow(dto.locationId(), propietario);
        Cubiculo cubiculo = cubiculoService.createCubiculo(dto, location);
        
        if (dto.disponibilidadCreateRequestDTO() != null && !dto.disponibilidadCreateRequestDTO().isEmpty()) {
            Map<DayOfWeek, Integer> nuevasPorDia =
                    dto.disponibilidadCreateRequestDTO()
                            .stream()
                            .collect(Collectors.groupingBy(
                                    DisponibilidadCreateRequestDTO::diaSemana,
                                    Collectors.summingInt(d -> 1)
                            ));

            disponibilidadService.validarLimiteDisponibilidades(cubiculo.getId(), nuevasPorDia);
            disponibilidadService.createDisponibilidades(dto.disponibilidadCreateRequestDTO(), cubiculo);
        }
        
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

    public Page<CubiculoResponse> findCubiculosByLocation(Long locationId, Long id, Pageable pageable) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);
        Location location = locationService.findByIdOrThrow(locationId, propietario);
        Page<Cubiculo> cubiculos = cubiculoService.findCubiculosByLocation(location, pageable);

        return cubiculos.map(c -> toResponse(c, location.getId()));
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

    public Page<CubiculoResponse> findActivedCubiculosByLocation(Long locationId, Long id, Pageable pageable) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);
        Location location = locationService.findByIdOrThrow(locationId, propietario);
        Page<Cubiculo> cubiculos = cubiculoService.findActiveCubiculosByLocation(location, true, pageable);

        return cubiculos.map(c -> toResponse(c, location.getId()));
    }

    public void activateCubiculo(Long cubiculoId, Long id) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);
        cubiculoService.activateCubiculo(cubiculoId, propietario);
    }

    public void desactivateCubiculo(Long cubiculoId, Long id) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(id);

        cubiculoService.desactivateCubiculo(cubiculoId, propietario);
    }

    public CubiculoResponse findById(Long cubiculoId, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        
        // Usar método optimizado con JOIN FETCH y validación de ownership
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdWithOwnershipAndCaracteristicas(cubiculoId, propietario);
        
        return toResponse(cubiculo, cubiculo.getLocation().getId());
    }
}
