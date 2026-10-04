import { sql } from "../database/db.js";

export const creationClient = async ({
  nom,
  prenom,
  email,
  telephone,
  adresse,
  complement_adresse = null,
  code_postal,
  ville,
  etage = 0,
}) => {
  const res = await sql.query(
    `INSERT INTO Clients (nom,
  prenom,
  email,
  telephone,
  adresse,
  complement_adresse,
  code_postal,
  ville,
  etage) VALUES ($1, $2, $3, $4,
  $5, $6, $7, $8,
  $9) RETURNING *`,
    [
      nom,
      prenom,
      email,
      telephone,
      adresse,
      complement_adresse,
      code_postal,
      ville,
      etage,
    ],
  );
  return res[0];
};

export const verifierClientExistant = async (email, telephone) => {
  const res = await sql.query(
    `
        SELECT * 
        FROM Clients
        WHERE email = $1 OR telephone = $2
        `,
    [email, telephone],
  );

  return res;
};
