package mx.sisati.sisatibackend.faq;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad PreguntaFaq
 */
@Repository
public interface PreguntaFaqRepository extends JpaRepository<PreguntaFaq, Long> {

    /**
     * Obtiene preguntas activas de una categoría, ordenadas por orden
     */
    List<PreguntaFaq> findByCategoriaNombreAndActivaTrueOrderByOrden(String categoriaNombre);

    /**
     * Obtiene todas las preguntas activas ordenadas por categoría y orden
     */
    List<PreguntaFaq> findByActivaTrueOrderByCategoria_OrdenAscOrdenAsc();

    /**
     * Obtiene todas las preguntas de una categoría
     */
    List<PreguntaFaq> findByCategoriaId(Long categoriaId);

    /**
     * Obtiene preguntas activas de una categoría con orden mayor o igual al especificado
     */
    List<PreguntaFaq> findByCategoriaIdAndOrdenGreaterThanEqualOrderByOrdenAsc(Long categoriaId, Integer orden);
}

