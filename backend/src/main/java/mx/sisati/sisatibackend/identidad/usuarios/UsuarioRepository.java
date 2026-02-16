package mx.sisati.sisatibackend.identidad.usuarios;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<Usuario> findByUsername(String username);
    
    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.roles WHERE u.username = :username")
    Optional<Usuario> findByUsernameWithRoles(String username);

    @Query("""
    SELECT u
    FROM Usuario u
    JOIN u.roles r
    WHERE r.nombre = 'OWNER'
    """)
    List<Usuario> findOwners();

    @Query("""
    SELECT u
    FROM Usuario u
    JOIN u.roles r
    WHERE r.nombre = 'PSICOLOGO'
    """)
    List<Usuario> findPsicologos();

    @Query("""
    SELECT u
    FROM Usuario u
    JOIN u.roles r
    WHERE r.nombre = 'ADMIN'
    """)
    List<Usuario> findAdmins();

    @Query("SELECT DISTINCT u FROM Usuario u LEFT JOIN FETCH u.roles")
    Page<Usuario> findAllWithRoles(Pageable pageable);


    @Modifying
    @Query("""
    update Usuario u
    set u.fotoPerfil = :archivoId
    where u.id = :usuarioId
""")
    void updateFotoPerfil(Long usuarioId, UUID archivoId);
}
