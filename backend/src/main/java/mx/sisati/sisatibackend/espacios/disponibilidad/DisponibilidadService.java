package mx.sisati.sisatibackend.espacios.disponibilidad;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadCreateRequestDTO;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class DisponibilidadService {

    public final DisponibilidadRepository disponibilidadRepository;

    public DisponibilidadService(DisponibilidadRepository disponibilidadRepository) {
        this.disponibilidadRepository = disponibilidadRepository;
    }

    @Transactional
    public void createDisponibilidades(List<DisponibilidadCreateRequestDTO> disponibilidadCreateRequestDTO, Cubiculo cubiculo){
        List<Disponibilidad> disponibilidades = disponibilidadCreateRequestDTO
                .stream()
                .map(d -> {
                    validarNoSuperposicion(cubiculo.getId(), d.diaSemana(), d.horaInicio(), d.horaFin(), null);
                    return new Disponibilidad(cubiculo, d.diaSemana(), d.horaInicio(), d.horaFin());
                })
                .toList();

        disponibilidadRepository.saveAll(disponibilidades);
    }

    @Transactional
    public void updateDisponibilidad(Long disponibilidadId, DayOfWeek diaSemana, LocalTime horaInicio, LocalTime horaFin) {
        Disponibilidad disponibilidad = disponibilidadRepository.findById(disponibilidadId)
                .orElseThrow(() -> new ServiceException(this.getClass(),"No existe la disponibilidad con ID: " + disponibilidadId));

        validarNoSuperposicion(disponibilidad.getCubiculo().getId(), diaSemana, horaInicio, horaFin, disponibilidadId);
        disponibilidad.update(diaSemana, horaInicio, horaFin);
        disponibilidadRepository.save(disponibilidad);
    }

    @Transactional
    public void deleteDisponibilidad(Long disponibilidadId) {
        if (!disponibilidadRepository.existsById(disponibilidadId)) {
            throw new ServiceException(this.getClass(),"No existe la disponibilidad con ID: " + disponibilidadId);
        }
        disponibilidadRepository.deleteById(disponibilidadId);
    }

    @Transactional
    public void deleteDisponibilidadesByCubiculo(Long cubiculoId) {
        List<Disponibilidad> disponibilidades = disponibilidadRepository.findByCubiculoId(cubiculoId);
        disponibilidadRepository.deleteAll(disponibilidades);
    }

    public List<Disponibilidad> findDisponibilidadesByCubiculo(Long cubiculoId) {
        return disponibilidadRepository.findByCubiculoId(cubiculoId);
    }

    public List<Disponibilidad> findDisponibilidadesByCubiculoAndDia(Long cubiculoId, DayOfWeek diaSemana) {
        return disponibilidadRepository.findByCubiculoIdAndDiaSemana(cubiculoId, diaSemana);
    }

    public List<Disponibilidad> findDisponibilidadesByRangoHorario(Long cubiculoId, LocalTime horaInicio, LocalTime horaFin) {
        return disponibilidadRepository.findByCubiculoIdAndRangoHorario(cubiculoId, horaInicio, horaFin);
    }

    public boolean existeDisponibilidadParaCubiculo(Long cubiculoId) {
        return disponibilidadRepository.existsByCubiculoId(cubiculoId);
    }

    private void validarNoSuperposicion(Long cubiculoId, DayOfWeek diaSemana, LocalTime horaInicio, LocalTime horaFin, Long disponibilidadIdExcluir) {
        List<Disponibilidad> disponibilidadesExistentes = disponibilidadRepository.findByCubiculoIdAndDiaSemana(cubiculoId, diaSemana);

        for (Disponibilidad existente : disponibilidadesExistentes) {
            if (existente.getId().equals(disponibilidadIdExcluir)) {
                continue;
            }

            if (haySuperposicion(horaInicio, horaFin, existente.getHoraInicio(), existente.getHoraFin())) {
                throw new ServiceException(this.getClass(), "La disponibilidad se superpone con una existente para el mismo día de la semana");
            }
        }
    }

    private boolean haySuperposicion(LocalTime nuevoInicio, LocalTime nuevoFin, LocalTime existenteInicio, LocalTime existenteFin) {
        return nuevoInicio.isBefore(existenteFin) && nuevoFin.isAfter(existenteInicio);
    }

    public void validarLimiteDisponibilidades(Long cubiculoId,
                                              Map<DayOfWeek, Integer> nuevasPorDia) {

        for (Map.Entry<DayOfWeek, Integer> entry : nuevasPorDia.entrySet()) {

            DayOfWeek dia = entry.getKey();
            int nuevasEseDia = entry.getValue();

            int existentesEseDia =
                    disponibilidadRepository.countByCubiculoIdAndDiaSemana(cubiculoId, dia);

            if (existentesEseDia + nuevasEseDia > 2) {
                throw new ServiceException(
                        this.getClass(),
                        "El cubículo ya tiene el máximo de 2 disponibilidades para el día " + dia
                );
            }
        }
    }

    public Disponibilidad findDisponibilidadById(Long disponibilidadId) {
        return disponibilidadRepository.findById(disponibilidadId)
                .orElseThrow(() -> new ServiceException(this.getClass(),"No existe la disponibilidad con ID: " + disponibilidadId));
    }

    public Disponibilidad validarReservaDentroDeDisponibilidad(
            Long cubiculoId,
            LocalDateTime inicio,
            LocalDateTime fin
    ) {
        DayOfWeek diaSemana = inicio.getDayOfWeek();
        LocalTime horaInicio = inicio.toLocalTime();
        LocalTime horaFin = fin.toLocalTime();

        List<Disponibilidad> disponibilidades =
                disponibilidadRepository.findByCubiculoIdAndDiaSemana(cubiculoId, diaSemana);

        if (disponibilidades.isEmpty()) {
            throw new ServiceException(this.getClass(),"CUBICULO_SIN_DISPONIBILIDAD_ESE_DIA");
        }

        for (Disponibilidad d : disponibilidades) {

            boolean dentro =
                    !horaInicio.isBefore(d.getHoraInicio()) &&
                            !horaFin.isAfter(d.getHoraFin());

            if (dentro) {
                return d;
            }
        }

        throw new ServiceException(this.getClass(),
                "RESERVA_FUERA_DE_HORARIO_DISPONIBLE");
    }
}
