package mx.sisati.sisatibackend.configuracionSistema;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfiguracionSistemaRepository extends JpaRepository<ConfiguracionSistema, Long> {
    List<ConfiguracionSistema> findByTipoUso(TipoUso tipoUso);
}
