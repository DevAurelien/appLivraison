import { sql } from "../database/db.js";

// export const upgradeLivreur = async ()=>{
//     const res = await sql.query(`
//         UPDATE users

//         `,[])
// }

export const affilierAgenceSalaries = async (
  user_id,
  agence_id,
  est_principale = true,
) => {
  const req = await sql.query(
    `
    INSERT INTO users_agences (
  user_id,
  agence_id,
  est_principale
)
VALUES ($1, $2, $3)
RETURNING *`,
    [user_id, agence_id, est_principale],
  );

  return req[0];
};

export const creerCamion = async (formulaire) => {
  const {
    energie,
    immatriculation,
    km,
    marque,
    modele,
    statut,
    agence_id,
  } = formulaire;

  const res = await sql.query(
    `
      INSERT INTO camions (
        immatriculation,
        marque,
        modele,
        agence_id,
        kilometrage,
        energie,
        statut
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
    [
      immatriculation,
      marque,
      modele,
      Number(agence_id),
      Number(km),
      energie.toUpperCase(),
      statut,
    ],
  );

  return res[0];
};

export const recupererCamions = async () => {
  const res = await sql.query(`
    SELECT camions.id, camions.immatriculation, camions.marque,
      camions.modele, camions.agence_id, camions.kilometrage,
      camions.energie, camions.statut, agences.nom AS agence_nom
    FROM camions
    LEFT JOIN agences ON agences.id = camions.agence_id
    ORDER BY camions.id;
  `);
  return res || [];
};

export const modifierCamion = async (id, formulaire) => {
  const { energie, immatriculation, km, marque, modele, statut, agence_id } = formulaire;
  const res = await sql.query(
    `UPDATE camions SET immatriculation = $2, marque = $3, modele = $4,
      agence_id = $5, kilometrage = $6, energie = $7, statut = $8
      WHERE id = $1 RETURNING *;`,
    [Number(id), immatriculation, marque, modele, Number(agence_id),
      Number(km), energie.toUpperCase(), statut],
  );
  return res[0] || null;
};

export const supprimerCamion = async (id) => {
  const res = await sql.query(
    `DELETE FROM camions WHERE id = $1 RETURNING *;`,
    [Number(id)],
  );
  return res[0] || null;
};

export const affecterCamionAgence = async (camionId, agenceId) => {
  const res = await sql.query(
    `WITH retrait_equipage AS (
      DELETE FROM camions_equipages WHERE camion_id = $1
    )
    UPDATE camions SET agence_id = $2 WHERE id = $1 RETURNING *;`,
    [camionId, agenceId],
  );
  return res[0] || null;
};
