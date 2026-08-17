import { sql } from "../database/db.js";

export const affilierSecteur = async ({
  nom,
  agence_id,
  jour_livraison,
  couleur,
  geometrie,
}) => {
  const res = await sql.query(
    `
      INSERT INTO secteurs (
        nom,
        agence_id,
        jour_livraison,
        couleur,
        geometrie
      )
      VALUES ($1, $2, $3, $4, $5::jsonb)
      RETURNING *;
    `,
    [
      nom,
      agence_id,
      jour_livraison,
      couleur,
      JSON.stringify(geometrie),
    ],
  );

  return res[0];
};

export const recupererSecteurs = async (agence_id) => {
  const res = await sql.query(
    `
      SELECT
        id,
        nom,
        agence_id,
        jour_livraison,
        couleur,
        geometrie
      FROM secteurs
      WHERE agence_id = $1
      ORDER BY id;
    `,
    [agence_id],
  );

  return res || [];
};

export const modifierSecteur = async ({
  id,
  nom,
  agence_id,
  jour_livraison,
  couleur,
  geometrie,
}) => {
  const res = await sql.query(
    `
      UPDATE secteurs
      SET
        nom = $2,
        agence_id = $3,
        jour_livraison = $4,
        couleur = $5,
        geometrie = $6::jsonb
      WHERE id = $1
      RETURNING *;
    `,
    [
      id,
      nom,
      agence_id,
      jour_livraison,
      couleur,
      JSON.stringify(geometrie),
    ],
  );

  return res[0] || null;
};

export const supprimerSecteur = async (id) => {
  const res = await sql.query(
    `
      DELETE FROM secteurs
      WHERE id = $1
      RETURNING *;
    `,
    [id],
  );

  return res[0] || null;
};
