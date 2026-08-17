ALTER TABLE pointages
  ADD COLUMN IF NOT EXISTS presence_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS pause_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS temps_travaille_minutes INTEGER;

CREATE OR REPLACE FUNCTION calculer_temps_pointage()
RETURNS TRIGGER AS $$
BEGIN
  NEW.pause_minutes := CASE
    WHEN NEW.start_pause_pointed_at IS NOT NULL
      AND NEW.end_pause_pointed_at IS NOT NULL
      AND NEW.end_pause_pointed_at >= NEW.start_pause_pointed_at
    THEN FLOOR(EXTRACT(EPOCH FROM (NEW.end_pause_pointed_at - NEW.start_pause_pointed_at)) / 60)::INTEGER
    ELSE NULL
  END;

  NEW.presence_minutes := CASE
    WHEN NEW.arrival_pointed_at IS NOT NULL
      AND NEW.departure_pointed_at IS NOT NULL
      AND NEW.departure_pointed_at >= NEW.arrival_pointed_at
    THEN FLOOR(EXTRACT(EPOCH FROM (NEW.departure_pointed_at - NEW.arrival_pointed_at)) / 60)::INTEGER
    ELSE NULL
  END;

  NEW.temps_travaille_minutes := CASE
    WHEN NEW.presence_minutes IS NOT NULL THEN
      GREATEST(0, NEW.presence_minutes - COALESCE(NEW.pause_minutes, 0))
    ELSE NULL
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calcul_temps_pointage ON pointages;
CREATE TRIGGER trg_calcul_temps_pointage
BEFORE INSERT OR UPDATE OF arrival_pointed_at, start_pause_pointed_at,
  end_pause_pointed_at, departure_pointed_at
ON pointages
FOR EACH ROW EXECUTE FUNCTION calculer_temps_pointage();

UPDATE pointages
SET arrival_pointed_at = arrival_pointed_at;
