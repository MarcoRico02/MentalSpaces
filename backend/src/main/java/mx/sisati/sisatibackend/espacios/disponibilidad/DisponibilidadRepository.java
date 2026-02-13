package mx.sisati.sisatibackend.espacios.disponibilidad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface DisponibilidadRepository extends JpaRepository<Disponibilidad, Long> {

    List<Disponibilidad> findByCubiculoId(Long cubiculoId);

    List<Disponibilidad> findByCubiculoIdAndDiaSemana(Long cubiculoId, DayOfWeek diaSemana);

    @Query("SELECT d FROM Disponibilidad d WHERE d.cubiculo.id = :cubiculoId AND " +
           "((d.horaInicio < :horaFin AND d.horaFin > :horaInicio))")
    List<Disponibilidad> findByCubiculoIdAndRangoHorario(
            @Param("cubiculoId") Long cubiculoId,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    boolean existsByCubiculoId(Long cubiculoId);

    @Query("SELECT COUNT(d) FROM Disponibilidad d WHERE d.cubiculo.id = :cubiculoId AND d.diaSemana = :diaSemana")
    int countByCubiculoIdAndDiaSemana(@Param("cubiculoId") Long cubiculoId, @Param("diaSemana") DayOfWeek diaSemana);

    @Query("SELECT d FROM Disponibilidad d WHERE d.cubiculo.id = :cubiculoId AND d.diaSemana = :diaSemana " +
           "ORDER BY d.horaInicio")
    List<Disponibilidad> findByCubiculoIdAndDiaSemanaOrderByHoraInicio(
            @Param("cubiculoId") Long cubiculoId, 
            @Param("diaSemana") DayOfWeek diaSemana
    );

    @Query("SELECT d FROM Disponibilidad d WHERE d.cubiculo.id = :cubiculoId " +
           "ORDER BY d.diaSemana, d.horaInicio")
    List<Disponibilidad> findByCubiculoIdOrderByDiaYHora(@Param("cubiculoId") Long cubiculoId);

    void deleteByCubiculoId(Long cubiculoId);

}
