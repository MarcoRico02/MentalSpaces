package mx.sisati.sisatibackend.validador.reserva.creacion;

import mx.sisati.sisatibackend.configuracionSistema.ConfiguracionSistema;
import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class ReglaIntervalo implements ReservaRegla {

    @Override
    public void validar(Map<String, ConfiguracionSistema> reglas,
                        LocalDateTime inicio,
                        LocalDateTime fin) {

        ConfiguracionSistema config = reglas.get("INTERVALO_RESERVA_MINUTOS");
        if (config == null) return;

        Long intervalo = config.getValorMinimo();
        if (intervalo == null || intervalo <= 0) return;

        if (!alineado(inicio, intervalo) || !alineado(fin, intervalo))
            throw new ServiceException(this.getClass(), "HORARIO_FUERA_DE_INTERVALO_PERMITIDO");
    }

    private boolean alineado(LocalDateTime fecha, Long intervalo) {
        int minutos = fecha.getHour() * 60 + fecha.getMinute();
        return minutos % intervalo == 0 && fecha.getSecond() == 0 && fecha.getNano() == 0;
    }

}