# README.MD

## Swagger api tester
http://localhost:8080/api/swagger-ui/index.html#/


## actuator links
http://localhost:8080/api/actuator/health
http://localhost:8080/api/actuator/metrics
http://localhost:8080/api/actuator/mappings
http://localhost:8080/api/actuator/loggers
## Datos base obligatorios
El sistema depende de la existencia de las siguientes tuplas en la base de datos.
Estos registros son estáticos y deben existir.

Si alguna tabla se encuentra vacía o incompleta, **NO iniciar el sistema**.
Notificar al DBA para la inserción manual de los registros pertinentes

⚠️ Nota:
La eliminación o modificación de estos registros puede provocar fallos críticos
en la autenticación y autorización del sistema.
### Roles

| id | nombre        |
|----|---------------|
| 1  | ADMIN         |
| 2  | PSICOLOGO     |
| 3  | PROPIETARIO  |

INSERT INTO roles (id, nombre) VALUES
(1, 'ADMIN'),
(2, 'PSICOLOGO'),
(3, 'PROPIETARIO');



### Caracteristicas de cubiculos
| id | nombre                   |
| -- |--------------------------|
| 1  | REFRIGERADO              |
| 2  | SIN_VENTANAS_EXTERNAS    |
| 3  | CLIMATIZACION            |
| 4  | VENTILACION_NATURAL      |
| 5  | ILUMINACION_CALIDA       |
| 6  | ILUMINACION_REGULABLE    |
| 7  | TEMPERATURA_CONTROLABLE  |
| 8  | SILLON_PARA_PACIENTE     |
| 9  | SILLON_PARA_PSICOLOGO    |
| 10 | ESCRITORIO               |
| 11 | MESA_AUXILIAR            |
| 12 | LIBRERO                  |
| 13 | SOFA                     |
| 14 | RELOJ_SILENCIOSO         |
| 15 | PIZARRON                 |
| 16 | CONEXION_INTERNET        |
| 17 | CAMARA_SEGURIDAD_EXTERNA |
| 18 | ENCHUFES_DISPONIBLES     |

INSERT INTO caracteristicas (id, nombre) VALUES
(1, 'REFRIGERADO'),
(2, 'SIN_VENTANAS_EXTERNAS'),
(3, 'CLIMATIZACION'),
(4, 'VENTILACION_NATURAL'),
(5, 'ILUMINACION_CALIDA'),
(6, 'ILUMINACION_REGULABLE'),
(7, 'TEMPERATURA_CONTROLABLE'),
(8, 'SILLON_PARA_PACIENTE'),
(9, 'SILLON_PARA_PSICOLOGO'),
(10, 'ESCRITORIO'),
(11, 'MESA_AUXILIAR'),
(12, 'LIBRERO'),
(13, 'SOFA'),
(14, 'RELOJ_SILENCIOSO'),
(15, 'PIZARRON'),
(16, 'CONEXION_INTERNET'),
(17, 'CAMARA_SEGURIDAD_EXTERNA'),
(18, 'ENCHUFES_DISPONIBLES');


## Configuración del sistema

INSERT INTO configuracion_sistema
(clave, valor_maximo, valor_minimo, tipo_uso, descripcion)
VALUES
('ANTICIPACION_CREACION_HORAS', 168, 1, 'RESERVA_CREACION', 'Anticipación mínima 1 hora, máxima 7 días'),
('DURACION_RESERVA_MINUTOS', 240, 30, 'RESERVA_CREACION', 'Duración entre 30 minutos y 4 horas'),
('INTERVALO_RESERVA_MINUTOS', NULL, 30, 'RESERVA_CREACION', 'Reservas en intervalos de 30 minutos')
ON CONFLICT (clave) DO NOTHING;