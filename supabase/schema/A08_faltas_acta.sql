-- ============================================================================
-- A08. REGISTRO INTERNO DE FALTAS LEVES (acta) junto a la ficha de reflexión.
--
-- Cada ficha generada tiene su acta: es el mismo hecho, así que comparten fila
-- y número (acta 001-2026 = ficha N.° 1 de 2026). Se guarda además el lugar
-- donde ocurrieron las faltas (sala de cómputo, aula...).
-- ============================================================================

alter table conduct_reflection_sheets add column if not exists place text;
