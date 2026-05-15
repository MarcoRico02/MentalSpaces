package mx.sisati.sisatibackend.validador.reserva.reagendamiento;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReservaValidadorReagendamientoService {

    private final List<ReservaReglaReagendamiento> reglas;

    public ReservaValidadorReagendamientoService(List<ReservaReglaReagendamiento> reglas) {
        this.reglas = reglas;
    }

    public void validarReglasReagendamiento(List<ConfiguracionSistema> configuraciones,
                                            LocalDateTime inicio,
                                            LocalDateTime fin) {

        Map<String, ConfiguracionSistema> mapa = configuraciones.stream()
                .collect(Collectors.toMap(
                        ConfiguracionSistema::getClave,
                        c -> c
                ));

        for (ReservaReglaReagendamiento regla : reglas) {
            regla.validar(mapa, inicio, fin);
        }
    }
}
