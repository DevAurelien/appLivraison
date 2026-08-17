CREATE TABLE IF NOT EXISTS canaux_discussion (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('AGENCE', 'LIVRAISON')),
  agence_id INTEGER REFERENCES agences(id) ON DELETE CASCADE,
  livraison_id INTEGER REFERENCES livraisons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((type = 'AGENCE' AND agence_id IS NOT NULL AND livraison_id IS NULL)
    OR (type = 'LIVRAISON' AND livraison_id IS NOT NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS canaux_discussion_agence_unique
  ON canaux_discussion (agence_id) WHERE type = 'AGENCE';
CREATE UNIQUE INDEX IF NOT EXISTS canaux_discussion_livraison_unique
  ON canaux_discussion (livraison_id) WHERE type = 'LIVRAISON';

CREATE TABLE IF NOT EXISTS messages_canaux (
  id BIGSERIAL PRIMARY KEY,
  canal_id BIGINT NOT NULL REFERENCES canaux_discussion(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contenu VARCHAR(2000) NOT NULL CHECK (length(trim(contenu)) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS messages_canaux_canal_date_idx ON messages_canaux (canal_id, created_at DESC);
