package mx.sisati.sisatibackend.espacios.caracteristicas;

import mx.sisati.sisatibackend.excepciones.ServiceException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CaracteristicaService {

    private final CaracteristicaRepository caracteristicaRepository;

    public CaracteristicaService(CaracteristicaRepository caracteristicaRepository) {
        this.caracteristicaRepository = caracteristicaRepository;
    }

    private Caracteristica getRequiredCaracteristica(CaracteristicaNombre nombre) {
        return caracteristicaRepository.findByNombre(nombre)
                .orElseThrow(() -> new ServiceException(
                        this.getClass(),
                        "No existe la caracteristica requerida en la base de datos: " + nombre
                ));
    }

    @Transactional(readOnly = true)
    public List<Caracteristica> findAll(){
        return caracteristicaRepository.findAll();
    }
}
