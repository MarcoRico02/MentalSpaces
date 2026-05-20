package mx.sisati.sisatibackend.faq;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad CategoriaFaq
 */
@Repository
public interface CategoriaFaqRepository extends JpaRepository<CategoriaFaq, Long> {

    /**
     * Obtiene las categorías activas ordenadas por orden
     */
    List<CategoriaFaq> findByActivaTrueOrderByOrden();

    /**
     * Obtiene una categoría por nombre
     */
    CategoriaFaq findByNombre(String nombre);

    /**
     * Obtiene categorías activas con orden mayor o igual al especificado
     */
    List<CategoriaFaq> findByActivaTrueAndOrdenGreaterThanEqualOrderByOrdenAsc(Integer orden);
}

