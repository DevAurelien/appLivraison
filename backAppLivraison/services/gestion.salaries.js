import { sql } from "../database/db.js";

export const recupSalaries = async (saisie, userId) => {
  const recup = await sql.query(
    `
      SELECT nom, prenom, id, avatar_img_url
      FROM users
      WHERE (prenom ILIKE $1 OR nom ILIKE $1)
        AND salarie = TRUE
        AND id != $2
    `,
    [`${saisie}%`, userId],
  );

  return recup;
};

export const recupImgSalaries = async (id) => {
  const resultat = await sql.query(
    `
      SELECT avatar_img_url
      FROM users
      WHERE id = $1
        AND salarie = TRUE
    `,
    [id],
  );

  return resultat[0]?.avatar_img_url ?? null;
};
