ALTER TABLE livraisons ADD COLUMN IF NOT EXISTS destinataire_nom VARCHAR(120);
ALTER TABLE livraisons ADD COLUMN IF NOT EXISTS destinataire_prenom VARCHAR(120);
ALTER TABLE livraisons ADD COLUMN IF NOT EXISTS destinataire_telephone VARCHAR(40);
ALTER TABLE livraisons ADD COLUMN IF NOT EXISTS donneur_ordre_nom VARCHAR(160);
