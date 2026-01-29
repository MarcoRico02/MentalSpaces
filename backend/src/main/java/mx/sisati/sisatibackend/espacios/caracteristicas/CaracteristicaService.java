package mx.sisati.sisatibackend.espacios.caracteristicas;

import mx.sisati.sisatibackend.excepciones.ServiceException;
import mx.sisati.sisatibackend.roles.Rol;
import mx.sisati.sisatibackend.roles.RolNombre;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaracteristicaService {

    private final CaracteristicaRepository caracteristicaRepository;

    public CaracteristicaService(CaracteristicaRepository caracteristicaRepository) {
        this.caracteristicaRepository = caracteristicaRepository;
    }


    private CaracteristicaNombre getRequiredCaracteristica(CaracteristicaNombre nombre) {
        return caracteristicaRepository.findByNombre(nombre)
                .orElseThrow(() -> new ServiceException(
                        this.getClass(),
                        "No existe la caracteristica requerida en la base de datos: " + nombre
                ));
    }

    public List<Caracteristica> findAll(){
        return caracteristicaRepository.findAll();
    }
}
