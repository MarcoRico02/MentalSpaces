package mx.sisati.sisatibackend.identidad.psicologos.dto;

import mx.sisati.sisatibackend.identidad.psicologos.DocumentationStatus;
import mx.sisati.sisatibackend.identidad.psicologos.Psicologo;

public record PsicologoInfoDTO(
        String professionalType,
        String identificationUrl,
        String diplomaUrl,
        DocumentationStatus documentationStatus
) {
    public PsicologoInfoDTO(Psicologo psicologo) {
        this(psicologo.getProfessionalType(), psicologo.getIdentificationUrl(), psicologo.getDiplomaUrl(), psicologo.getDocumentationStatus());
    }
}