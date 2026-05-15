package mx.sisati.sisatibackend.validador.reserva.reagendamiento;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ReagendamientoReglaAnticipacion implements ReservaReglaReagendamiento {

    private final Clock clock;

    public ReagendamientoReglaAnticipacion(Clock clock) {
        this.clock = clock;
    }

    @Override
    public void validar(Map<String, ConfiguracionSistema> reglas,
                        LocalDateTime inicio,
                        LocalDateTime fin) {

        ConfiguracionSistema config = reglas.get("RESERVA_REAGENDAMIENTO_HORAS");
        if (config == null) return;

        long horas = Duration.between(LocalDateTime.now(clock), inicio).toHours();

        if (config.getValorMinimo() != null && horas < config.getValorMinimo())
            throw new ServiceException(this.getClass(), "ANTICIPACION_MENOR_A_MINIMO");

        if (config.getValorMaximo() != null && horas > config.getValorMaximo())
            throw new ServiceException(this.getClass(), "ANTICIPACION_MAYOR_A_MAXIMO");
    }
}
