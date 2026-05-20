-- Script de validación para FAQs en Neon
-- Ejecutar después de aplicar las migraciones

-- PASO 1: Verificar que las tablas existan
SELECT
    table_name
FROM
    information_schema.tables
WHERE
    table_schema = 'public'
    AND table_name IN ('faq_categorias', 'faq_preguntas')
ORDER BY
    table_name;

-- PASO 2: Verificar la estructura de la tabla faq_categorias
\d faq_categorias

-- PASO 3: Verificar la estructura de la tabla faq_preguntas
\d faq_preguntas

-- PASO 4: Contar categorías insertadas
SELECT
    COUNT(*) as total_categorias,
    COUNT(CASE WHEN activa = true THEN 1 END) as categorias_activas
FROM
    faq_categorias;

-- PASO 5: Contar preguntas insertadas
SELECT
    COUNT(*) as total_preguntas,
    COUNT(CASE WHEN activa = true THEN 1 END) as preguntas_activas
FROM
    faq_preguntas;

-- PASO 6: Ver todas las categorías con sus preguntas
SELECT
    c.id as categoria_id,
    c.nombre as categoria_nombre,
    c.descripcion,
    COUNT(p.id) as cantidad_preguntas,
    c.activa,
    c.orden
FROM
    faq_categorias c
LEFT JOIN
    faq_preguntas p ON c.id = p.categoria_id AND p.activa = true
WHERE
    c.activa = true
GROUP BY
    c.id, c.nombre, c.descripcion, c.activa, c.orden
ORDER BY
    c.orden;

-- PASO 7: Ver preguntas de una categoría específica
SELECT
    p.id,
    p.pregunta,
    p.respuesta,
    p.orden,
    p.activa,
    c.nombre as categoria
FROM
    faq_preguntas p
JOIN
    faq_categorias c ON p.categoria_id = c.id
WHERE
    c.nombre = 'Pagos'
    AND p.activa = true
ORDER BY
    p.orden;

-- PASO 8: Verificar integridad de datos (sin preguntas huérfanas)
SELECT
    p.id as pregunta_orfana_id
FROM
    faq_preguntas p
LEFT JOIN
    faq_categorias c ON p.categoria_id = c.id
WHERE
    c.id IS NULL;

-- PASO 9: Verificar que no hay duplicados en nombres de categorías
SELECT
    nombre,
    COUNT(*) as duplicados
FROM
    faq_categorias
GROUP BY
    nombre
HAVING
    COUNT(*) > 1;

-- PASO 10: Obtener datos para API (simula lo que retorna GET /faqs)
SELECT
    json_agg(
        json_build_object(
            'categoria', json_build_object(
                'id', c.id,
                'nombre', c.nombre,
                'descripcion', c.descripcion,
                'orden', c.orden,
                'activa', c.activa,
                'icono', c.icono
            ),
            'preguntas', (
                SELECT
                    json_agg(
                        json_build_object(
                            'id', p.id,
                            'categoriaId', p.categoria_id,
                            'pregunta', p.pregunta,
                            'respuesta', p.respuesta,
                            'orden', p.orden,
                            'activa', p.activa
                        )
                        ORDER BY p.orden
                    )
                FROM faq_preguntas p
                WHERE p.categoria_id = c.id AND p.activa = true
            )
        )
        ORDER BY c.orden
    ) as response
FROM
    faq_categorias c
WHERE
    c.activa = true;

