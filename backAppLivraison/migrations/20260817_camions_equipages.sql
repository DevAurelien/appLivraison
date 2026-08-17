CREATE TABLE IF NOT EXISTS camions_equipages (
  camion_id INTEGER NOT NULL REFERENCES camions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position SMALLINT NOT NULL CHECK (position IN (1, 2)),
  affecte_par INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (camion_id, user_id),
  UNIQUE (camion_id, position),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_camions_equipages_camion
  ON camions_equipages(camion_id);
