## Datos base obligatorios (Roles del sistema)

El sistema depende de la existencia de los siguientes roles en la base de datos.
Estos registros son estáticos y deben existir.

Si la tabla `roles` se encuentra vacía o incompleta, **NO iniciar el sistema**.
Notificar al DBA para la inserción manual de los siguientes registros:

| id | nombre        |
|----|---------------|
| 1  | ADMIN         |
| 2  | PSICOLOGO     |
| 3  | PROPIETARIO  |

INSERT INTO roles (id, nombre) VALUES
(1, 'ADMIN'),
(2, 'PSICOLOGO'),
(3, 'PROPIETARIO');

⚠️ Nota:
La eliminación o modificación de estos registros puede provocar fallos críticos
en la autenticación y autorización del sistema.
