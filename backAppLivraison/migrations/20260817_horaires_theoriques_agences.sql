ALTER TABLE agences
  ADD COLUMN IF NOT EXISTS duree_travail_journaliere_minutes INTEGER NOT NULL DEFAULT 420,
  ADD COLUMN IF NOT EXISTS pause_prevue_minutes INTEGER NOT NULL DEFAULT 45;

ALTER TABLE agences
  DROP CONSTRAINT IF EXISTS chk_duree_travail_journaliere,
  ADD CONSTRAINT chk_duree_travail_journaliere
    CHECK (duree_travail_journaliere_minutes BETWEEN 1 AND 720),
  DROP CONSTRAINT IF EXISTS chk_pause_prevue,
  ADD CONSTRAINT chk_pause_prevue
    CHECK (pause_prevue_minutes BETWEEN 0 AND 240);
