-- Roda uma unica vez, quando o volume do Postgres e criado do zero.
-- pgvector adiciona ao Postgres o tipo de coluna `vector` e os operadores de
-- distancia usados na busca por similaridade. E o que torna este banco, alem
-- de relacional, tambem o nosso banco vetorial.
CREATE EXTENSION IF NOT EXISTS vector;
