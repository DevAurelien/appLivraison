ALTER TABLE executions_livraisons ADD COLUMN IF NOT EXISTS decharge_risque TEXT;
ALTER TABLE executions_livraisons ADD COLUMN IF NOT EXISTS decharge_signataire VARCHAR(200);
ALTER TABLE executions_livraisons ADD COLUMN IF NOT EXISTS decharge_accepte_risques BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE executions_livraisons ADD COLUMN IF NOT EXISTS decharge_conserve_produit BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE executions_livraisons ADD COLUMN IF NOT EXISTS decharge_signee_le TIMESTAMPTZ;
