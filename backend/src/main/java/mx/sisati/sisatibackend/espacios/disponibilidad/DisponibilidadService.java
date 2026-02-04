package mx.sisati.sisatibackend.espacios.disponibilidad;

import mx.sisati.sisatibackend.espacios.cubiculo.Cubiculo;
import mx.sisati.sisatibackend.espacios.disponibilidad.dto.DisponibilidadCreateRequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisponibilidadService {

    public final DisponibilidadRepository disponibilidadRepository;

    public DisponibilidadService(DisponibilidadRepository disponibilidadRepository) {
        this.disponibilidadRepository = disponibilidadRepository;
    }

    public void createDisponibilidades(List<DisponibilidadCreateRequestDTO> disponibilidadCreateRequestDTO, Cubiculo cubiculo){
        List<Disponibilidad> disponibilidades = disponibilidadCreateRequestDTO
                .stream()
                .map(d -> {
                    return new Disponibilidad(cubiculo, d.diaSemana(), d.horaInicio(), d.horaFin());
                })
                .toList();

        disponibilidadRepository.saveAll(disponibilidades);
    }
}
