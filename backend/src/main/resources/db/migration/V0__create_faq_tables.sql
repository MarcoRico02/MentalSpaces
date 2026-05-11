-- Script de creación de tablas para FAQs
-- Tabla para categorías de preguntas frecuentes

CREATE TABLE IF NOT EXISTS faq_categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(500),
    orden INTEGER NOT NULL DEFAULT 0,
    activa BOOLEAN NOT NULL DEFAULT true,
    icono VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_faq_categorias_activa ON faq_categorias(activa);
CREATE INDEX IF NOT EXISTS idx_faq_categorias_nombre ON faq_categorias(nombre);
CREATE INDEX IF NOT EXISTS idx_faq_categorias_orden ON faq_categorias(orden);

-- Tabla para preguntas frecuentes
CREATE TABLE IF NOT EXISTS faq_preguntas (
    id BIGSERIAL PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    activa BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_faq_preguntas_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES faq_categorias(id)
        ON DELETE CASCADE
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_faq_preguntas_categoria_id ON faq_preguntas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_faq_preguntas_activa ON faq_preguntas(activa);
CREATE INDEX IF NOT EXISTS idx_faq_preguntas_orden ON faq_preguntas(orden);
CREATE INDEX IF NOT EXISTS idx_faq_preguntas_categoria_orden
    ON faq_preguntas(categoria_id, orden);

