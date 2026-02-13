package mx.sisati.sisatibackend.espacios.cubiculo;

import mx.sisati.sisatibackend.espacios.caracteristicas.Caracteristica;
import mx.sisati.sisatibackend.espacios.caracteristicas.CaracteristicaRepository;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.CubiculoCreateRequestDTO;
import mx.sisati.sisatibackend.espacios.cubiculo.dto.CubiculoUpdateRequestDTO;
import mx.sisati.sisatibackend.espacios.locations.Location;
import mx.sisati.sisatibackend.excepciones.DomainException;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        Set<Caracteristica> caracteristicas = validateAndResolveCaracteristicas(dto.caracteristicasIds());

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

        // Validar y resolver características (null = no modificar, vacío = eliminar todas)
        Set<Caracteristica> caracteristicas = validateAndResolveCaracteristicas(dto.caracteristicasIds());
        
        // Si es null, mantener las características actuales
        if (caracteristicas == null) {
            caracteristicas = cubiculo.getCaracteristicas();
        }

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

    public Page<Cubiculo> findCubiculosByLocation(Location location, Pageable pageable) {
        return cubiculoRepository.findByLocationId(location.getId(), pageable);
    }

    public Page<Cubiculo> findActiveCubiculosByLocation(Location location, boolean active, Pageable pageable) {
        return cubiculoRepository.findByLocationIdAndActive(location.getId(), active, pageable);
    }

    public Cubiculo findCubiculoByIdAndValidateOwnership(Long cubiculoId, Propietario propietario) {
        Cubiculo cubiculo = cubiculoRepository.findById(cubiculoId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "Cubículo no encontrado"));

        if (!cubiculo.getLocation().getPropietario().getId().equals(propietario.getId())) {
            throw new ServiceException(this.getClass(), "El cubículo no pertenece al propietario autenticado");
        }

        return cubiculo;
    }

    public Cubiculo getByCubiculoIdOrThrow(Long id){
        return cubiculoRepository.findById(id).orElseThrow(() -> new ServiceException(this.getClass(),"CUBICULO_NOT_FOUND"));
    }

    public void deactivateAllCubiculosByLocation(Location location) {
        Page<Cubiculo> cubiculosPage;
        int page = 0;
        int size = 100;
        
        do {
            Pageable pageable = Pageable.ofSize(size).withPage(page);
            cubiculosPage = cubiculoRepository.findByLocationId(location.getId(), pageable);
            
            for (Cubiculo cubiculo : cubiculosPage.getContent()) {
                if (cubiculo.isActive()) {
                    cubiculo.deactivate();
                }
            }
            
            cubiculoRepository.saveAll(cubiculosPage.getContent());
            page++;
        } while (cubiculosPage.hasNext());
    }

    /**
     * Obtiene un cubículo por ID con sus características cargadas mediante JOIN FETCH.
     * Optimiza el performance evitando el problema N+1 al obtener características.
     * 
     * @param cubiculoId ID del cubículo a buscar
     * @return Cubiculo con sus características cargadas
     * @throws ServiceException si el cubículo no existe
     */
    @Transactional(readOnly = true)
    public Cubiculo findCubiculoByIdWithCaracteristicas(Long cubiculoId) {
        return cubiculoRepository.findByIdWithCaracteristicas(cubiculoId)
                .orElseThrow(() -> new ServiceException(this.getClass(), "Cubículo no encontrado con ID: " + cubiculoId));
    }

    /**
     * Obtiene un cubículo por ID con validación de ownership y características optimizada.
     * 
     * @param cubiculoId ID del cubículo a buscar
     * @param propietario Propietario para validar ownership
     * @return Cubiculo con sus características cargadas
     * @throws ServiceException si el cubículo no existe o no pertenece al propietario
     */
    @Transactional(readOnly = true)
    public Cubiculo findCubiculoByIdWithOwnershipAndCaracteristicas(Long cubiculoId, Propietario propietario) {
        Cubiculo cubiculo = findCubiculoByIdWithCaracteristicas(cubiculoId);
        
        if (!cubiculo.getLocation().getPropietario().getId().equals(propietario.getId())) {
            throw new ServiceException(this.getClass(), "El cubículo no pertenece al propietario autenticado");
        }
        
        return cubiculo;
    }

    /**
     * Valida y resuelve las características para un cubículo.
     * 
     * Comportamiento de caracteristicasIds:
     * - null → "no modificar características" (solo en update)
     * - Set vacío → "eliminar todas las características del cubículo"
     * - Set con IDs → "asignar estas características" (todos deben existir)
     * 
     * Performance: Usa findAllById para evitar N+1 queries
     * 
     * @param caracteristicasIds Set de IDs de características (puede ser null o vacío)
     * @return Set<Caracteristica> características validadas, o null si no se debe modificar
     * @throws DomainException si hay IDs inexistentes
     */
    private Set<Caracteristica> validateAndResolveCaracteristicas(Set<Long> caracteristicasIds) {
        // null = no modificar características (solo en update)
        if (caracteristicasIds == null) {
            return null;
        }
        
        // Set vacío = eliminar todas las características
        if (caracteristicasIds.isEmpty()) {
            return Set.of();
        }
        
        // Optimización de performance: usar findAllById en lugar de findById individual
        // Esto resuelve el problema N+1 haciendo una sola query
        List<Caracteristica> foundCaracteristicas = caracteristicaRepository.findAllById(caracteristicasIds);
        
        // Validar que todos los IDs solicitados existen
        if (foundCaracteristicas.size() != caracteristicasIds.size()) {
            Set<Long> foundIds = foundCaracteristicas.stream()
                    .map(Caracteristica::getId)
                    .collect(Collectors.toSet());
            
            Set<Long> missingIds = caracteristicasIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .collect(Collectors.toSet());
                    
            throw new DomainException("Características no encontradas con IDs: " + missingIds);
        }
        
        return foundCaracteristicas.stream().collect(Collectors.toSet());
    }

    public Location getLocationByCubiculoIdOrThrow(Long cubiculoId) {
        return cubiculoRepository.findById(cubiculoId)
                .map(Cubiculo::getLocation)
                .orElseThrow(() -> new ServiceException(this.getClass(), "No se encontró la locación para el cubículo"));
    }
}