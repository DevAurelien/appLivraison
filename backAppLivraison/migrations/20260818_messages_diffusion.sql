CREATE TABLE IF NOT EXISTS messages_diffusion (
  id BIGSERIAL PRIMARY KEY,
  auteur_id INTEGER NOT NULL REFERENCES users(id),
  titre VARCHAR(120) NOT NULL,
  contenu TEXT NOT NULL CHECK (length(trim(contenu)) BETWEEN 3 AND 2000),
  cible_type VARCHAR(30) NOT NULL CHECK (cible_type IN ('TOUS_SALARIES', 'TOUS_CLIENTS', 'AGENCE', 'ROLE', 'UTILISATEUR')),
  cible_agence_id INTEGER REFERENCES agences(id) ON DELETE CASCADE,
  cible_role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  cible_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expire_le TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS messages_diffusion_date_idx ON messages_diffusion (created_at DESC);
