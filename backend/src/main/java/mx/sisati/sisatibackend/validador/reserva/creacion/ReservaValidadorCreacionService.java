package mx.sisati.sisatibackend.validador.reserva.creacion;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReservaValidadorCreacionService {


    private final List<ReservaRegla> reglas;

    public ReservaValidadorCreacionService(List<ReservaRegla> reglas) {
        this.reglas = reglas;
    }

    public void validarReglasCreacion(List<ConfiguracionSistema> configuraciones,
                                      LocalDateTime inicio,
                                      LocalDateTime fin) {

        Map<String, ConfiguracionSistema> mapa = configuraciones.stream()
                .collect(Collectors.toMap(
                        ConfiguracionSistema::getClave,
                        c -> c
                ));

        for (ReservaRegla regla : reglas) {
            regla.validar(mapa, inicio, fin);
        }
    }
}
