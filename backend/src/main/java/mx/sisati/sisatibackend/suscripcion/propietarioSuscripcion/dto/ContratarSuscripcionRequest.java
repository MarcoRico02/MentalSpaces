package mx.sisati.sisatibackend.suscripcion.propietarioSuscripcion.dto;

public record ContratarSuscripcionRequest(
    Long suscripcionId,
    Boolean autoRenovacion
) {
    public ContratarSuscripcionRequest {
        if (suscripcionId == null) {
            throw new IllegalArgumentException("El ID de la suscripción es obligatorio");
        }
    }
}
