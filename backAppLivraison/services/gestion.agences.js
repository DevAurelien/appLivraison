import { sql } from "../database/db.js";

export const creeAgence = async (
  nom,
  nomComplet,
  heure_embauche,
  heure_embauche_modifiee_par,
) => {
  const res = await sql.query(
    `
        INSERT INTO agences (
  nom,
  nom_complet,
  heure_embauche,
  heure_embauche_modifiee_at,
  heure_embauche_modifiee_par
)
VALUES ($1, $2, $3, NOW(), $4)
RETURNING *;
        `,
    [nom, nomComplet, heure_embauche, heure_embauche_modifiee_par],
  );
  return res[0];
};

export const getListeAgences = async () => {
  const res = await sql.query(`
    SELECT id, nom, nom_complet, heure_embauche,
      heure_embauche_modifiee_at, heure_embauche_modifiee_par
    FROM agences
    ORDER BY nom
    `);
  return res || [];
};

export const modifierAgence = async (
  id,
  nom,
  nomComplet,
  heureEmbauche,
  utilisateurId,
) => {
  const res = await sql.query(
    `UPDATE agences
      SET nom = $2, nom_complet = $3, heure_embauche = $4,
        heure_embauche_modifiee_at = NOW(),
        heure_embauche_modifiee_par = $5
      WHERE id = $1
      RETURNING *;`,
    [id, nom, nomComplet, heureEmbauche, utilisateurId],
  );
  return res[0] || null;
};

export const supprimerAgence = async (id) => {
  const res = await sql.query(
    `DELETE FROM agences WHERE id = $1 RETURNING *;`,
    [id],
  );
  return res[0] || null;
};
