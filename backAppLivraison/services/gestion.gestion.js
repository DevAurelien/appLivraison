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
      14,
      Number(km),
      energie.toUpperCase(),
      statut,
    ],
  );

  return res[0];
};