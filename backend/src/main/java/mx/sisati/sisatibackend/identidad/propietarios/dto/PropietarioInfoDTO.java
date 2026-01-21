package mx.sisati.sisatibackend.identidad.propietarios.dto;

import mx.sisati.sisatibackend.identidad.propietarios.Propietario;

public record PropietarioInfoDTO(
        String rfc,
        boolean facturacionHabilitada
) {
    public PropietarioInfoDTO(Propietario propietario) {
        this(propietario.getRfc(), propietario.isFacturacionHabilitada());
    }
}