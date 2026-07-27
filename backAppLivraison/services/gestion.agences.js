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
    [
      nom,
      nomComplet,
      heure_embauche,
      heure_embauche_modifiee_par,
    ],
  );
  return res[0];
};
