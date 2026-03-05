package mx.sisati.sisatibackend.archivo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArchivoRepository extends JpaRepository<Archivo, UUID> {

    List<Archivo> findByTipoEntidadAndEntidadReferenciada(TipoEntidad tipoEntidad, Long entidadReferenciada);

}