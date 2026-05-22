package mx.sisati.sisatibackend.reserva;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long>, JpaSpecificationExecutor<Reserva> {
    @Query("""
        SELECT COUNT(r) > 0
        FROM Reserva r
        WHERE r.cubiculo.id = :cubiculoId
        AND r.inicio < :finNueva
        AND r.fin > :inicioNueva
    """)
    boolean existeSolapamiento(@Param("cubiculoId") Long cubiculoId,
                               @Param("inicioNueva") LocalDateTime inicioNueva,
                               @Param("finNueva") LocalDateTime finNueva);
}
