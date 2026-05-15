package mx.sisati.sisatibackend.validador.reserva.reagendamiento;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;

import java.time.LocalDateTime;
import java.util.Map;

public interface ReservaReglaReagendamiento {
    void validar(Map<String, ConfiguracionSistema> reglas,
                 LocalDateTime inicio,
                 LocalDateTime fin);
}
