package mx.sisati.sisatibackend.espacios.disponibilidad.aplicacion;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.cubiculo.CubiculoService;
import mx.sisati.sisatibackend.espacios.disponibilidad.Disponibilidad;
import mx.sisati.sisatibackend.espacios.disponibilidad.DisponibilidadService;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadCreateRequestDTO;
import mx.sisati.sisatibackend.identidad.propietarios.Propietario;
import mx.sisati.sisatibackend.identidad.propietarios.PropietarioService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GestionarDisponibilidades {

    private final PropietarioService propietarioService;
    private final CubiculoService cubiculoService;
    private final DisponibilidadService disponibilidadService;

    public GestionarDisponibilidades(PropietarioService propietarioService, CubiculoService cubiculoService, DisponibilidadService disponibilidadService) {
        this.propietarioService = propietarioService;
        this.cubiculoService = cubiculoService;
        this.disponibilidadService = disponibilidadService;
    }

    public List<Disponibilidad> getDisponibilidadesByCubiculo(Long cubiculoId, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);
        return disponibilidadService.findDisponibilidadesByCubiculo(cubiculo.getId());
    }

    public List<Disponibilidad> getDisponibilidadesByCubiculoAndDia(Long cubiculoId, Long usuarioId, DayOfWeek diaSemana) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);
        return disponibilidadService.findDisponibilidadesByCubiculoAndDia(cubiculo.getId(), diaSemana);
    }

    @Transactional
    public void updateDisponibilidad(Long disponibilidadId, Long usuarioId, DayOfWeek diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);

        // Validar que la disponibilidad pertenezca a un cubículo del propietario
        Disponibilidad disponibilidad = disponibilidadService.findDisponibilidadById(disponibilidadId);
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdAndValidateOwnership(disponibilidad.getCubiculo().getId(), propietario);

        disponibilidadService.updateDisponibilidad(disponibilidadId, diaSemana, horaInicio, horaFin);
    }

    @Transactional
    public void deleteDisponibilidad(Long disponibilidadId, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);

        // Validar que la disponibilidad pertenezca a un cubículo del propietario
        Disponibilidad disponibilidad = disponibilidadService.findDisponibilidadById(disponibilidadId);
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdAndValidateOwnership(disponibilidad.getCubiculo().getId(), propietario);

        disponibilidadService.deleteDisponibilidad(disponibilidadId);
    }

    @Transactional
    public void deleteAllDisponibilidadesByCubiculo(Long cubiculoId, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);
        disponibilidadService.deleteDisponibilidadesByCubiculo(cubiculo.getId());
    }

    public boolean tieneDisponibilidades(Long cubiculoId, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);
        return disponibilidadService.existeDisponibilidadParaCubiculo(cubiculo.getId());
    }

    @Transactional
    public void createDisponibilidades(Long cubiculoId, List<DisponibilidadCreateRequestDTO> dtos, Long usuarioId) {
        Propietario propietario = propietarioService.getByUsuarioIdOrThrow(usuarioId);
        Cubiculo cubiculo = cubiculoService.findCubiculoByIdAndValidateOwnership(cubiculoId, propietario);
        Map<DayOfWeek, Integer> nuevasPorDia =
                dtos.stream()
                        .collect(Collectors.groupingBy(
                                DisponibilidadCreateRequestDTO::diaSemana,
                                Collectors.summingInt(d -> 1)
                        ));

        disponibilidadService.validarLimiteDisponibilidades(cubiculo.getId(), nuevasPorDia);
        disponibilidadService.createDisponibilidades(dtos, cubiculo);
    }
}
