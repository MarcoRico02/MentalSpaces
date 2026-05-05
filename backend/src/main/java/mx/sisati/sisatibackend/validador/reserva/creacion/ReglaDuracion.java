package mx.sisati.sisatibackend.validador.reserva.creacion;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ReglaDuracion implements ReservaRegla {

    @Override
    public void validar(Map<String, ConfiguracionSistema> reglas,
                        LocalDateTime inicio,
                        LocalDateTime fin) {

        ConfiguracionSistema config = reglas.get("DURACION_RESERVA_MINUTOS");
        if (config == null) return;

        long duracion = Duration.between(inicio, fin).toMinutes();

        if (config.getValorMinimo() != null && duracion < config.getValorMinimo())
            throw new ServiceException(this.getClass(), "DURACION_MENOR_A_MINIMO");

        if (config.getValorMaximo() != null && duracion > config.getValorMaximo())
            throw new ServiceException(this.getClass(), "DURACION_MAYOR_A_MAXIMO");
    }
}