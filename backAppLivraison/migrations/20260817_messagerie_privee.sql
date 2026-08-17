CREATE TABLE IF NOT EXISTS conversations_privees (
  id BIGSERIAL PRIMARY KEY,
  user_1_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_2_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT conversations_utilisateurs_distincts CHECK (user_1_id < user_2_id),
  CONSTRAINT conversations_privees_unique UNIQUE (user_1_id, user_2_id)
);

CREATE TABLE IF NOT EXISTS messages_prives (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations_privees(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contenu VARCHAR(2000) NOT NULL CHECK (length(trim(contenu)) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lu_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS messages_prives_conversation_date_idx
  ON messages_prives (conversation_id, created_at DESC);
