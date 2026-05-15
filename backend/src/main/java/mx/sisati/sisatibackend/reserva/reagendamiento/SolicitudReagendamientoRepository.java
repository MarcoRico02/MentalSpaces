package mx.sisati.sisatibackend.reserva.reagendamiento;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudReagendamientoRepository extends JpaRepository<SolicitudReagendamiento, Long> {

    boolean existsByReservaIdAndEstadoSolicitud(Long reservaId, EstadoSolicitudReagendamiento estadoSolicitud);
}
