package mx.sisati.sisatibackend.reserva;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    @Query("""
SELECT COUNT(r) > 0
FROM Reserva r
WHERE r.cubiculo.id = :cubiculoId
AND r.inicio < :finNueva
AND r.fin > :inicioNueva
""")
    boolean existeSolapamiento(Long cubiculoId,
                               LocalDateTime inicioNueva,
                               LocalDateTime finNueva);

    // Devuelve las reservas de un psicólogo ordenadas por inicio (descendente)
    List<Reserva> findByPsicologoIdOrderByInicioDesc(Long psicologoId);
}