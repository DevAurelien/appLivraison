ALTER TABLE camions_equipages
  DROP CONSTRAINT IF EXISTS camions_equipages_position_check,
  DROP CONSTRAINT IF EXISTS camions_equipages_user_id_key;

ALTER TABLE camions_equipages
  ADD CONSTRAINT camions_equipages_position_check
    CHECK (position IN (1, 2, 3));
