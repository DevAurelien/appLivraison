CREATE TABLE IF NOT EXISTS journal_roles_utilisateurs (
  id BIGSERIAL PRIMARY KEY,
  auteur_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  utilisateur_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ancien_role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  nouveau_role_id INTEGER NOT NULL REFERENCES roles(id),
  motif VARCHAR(500) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_roles_utilisateur_date
  ON journal_roles_utilisateurs (utilisateur_id, created_at DESC);
