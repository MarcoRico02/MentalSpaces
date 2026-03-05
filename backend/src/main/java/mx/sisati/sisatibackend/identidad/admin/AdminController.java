package mx.sisati.sisatibackend.identidad.admin;

import mx.sisati.sisatibackend.identidad.admin.aplicacion.GestionarAdmin;
import mx.sisati.sisatibackend.identidad.admin.dto.AdminRegisterRequestDTO;
import mx.sisati.sisatibackend.identidad.admin.dto.AdminRegisterResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/admins")
public class AdminController {

    private final GestionarAdmin gestionarAdmin;

    public AdminController(GestionarAdmin gestionarAdmin) {
        this.gestionarAdmin = gestionarAdmin;
    }


    @PostMapping()
    public ResponseEntity<AdminRegisterResponseDTO> bringAdminAcces(@RequestBody AdminRegisterRequestDTO adminRegisterRequestDTO){
        Admin admin = gestionarAdmin.bringAdminAcces(adminRegisterRequestDTO);
        AdminRegisterResponseDTO respuesta = new AdminRegisterResponseDTO(admin);
        return ResponseEntity.created(URI.create("/admins/" + respuesta.usuarioRegisterResponseDTO().id())).body(respuesta);
    }
}
