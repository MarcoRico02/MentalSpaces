package mx.sisati.sisatibackend.finanzas.pagoSuscripcion;

import mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.PropietarioSuscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PagoSuscripcionRepository extends JpaRepository<PagoSuscripcion, UUID> {

    List<PagoSuscripcion> findByPropietarioSuscripcion(PropietarioSuscripcion propietarioSuscripcion);
}