package mx.sisati.sisatibackend.validador.reserva.creacion;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;

import java.time.LocalDateTime;
import java.util.Map;

public interface ReservaRegla {
    void validar(Map<String, ConfiguracionSistema> reglas,
                 LocalDateTime inicio,
                 LocalDateTime fin);
}