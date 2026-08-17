import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import "dotenv/config";
import { sql } from "../database/db.js";

// const USERS_FILE = "./users.json";

export const creerUser = async (
  email,
  password,
  nom,
  prenom,
  birth,
  phone,
  avatar_img_url,
) => {
  const userExiste =
    await verifierUserExistantRegister(email);

  if (userExiste) {
    throw new Error("Utilisateur déjà existant");
  }

  const pass = await hash(password, 10);

  const userCree = await sql.query(
    `
      INSERT INTO users (
        email,
        password,
        nom,
        prenom,
        birth,
        phone,
        avatar_img_url
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING id
    `,
    [
      email,
      pass,
      nom,
      prenom,
      birth,
      phone,
      avatar_img_url,
    ],
  );

  if (!userCree[0]) {
    throw new Error(
      "Impossible de créer l’utilisateur",
    );
  }

  return recupererUtilisateurPourAutorisation(
    userCree[0].id,
  );
};

export const loginUser = async (email, password) => {
  const resultat = await sql.query(
    `
      SELECT
        id,
        password
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  // console.log("RÉPONSE LOGIN :", resultat);
  if (!resultat[0]) {
    throw new Error("Identifiants incorrects");
  }

  const passwordOk = await compare(password, resultat[0].password);

  if (!passwordOk) {
    throw new Error("Identifiants incorrects");
  }

  return await recupererUtilisateurPourAutorisation(resultat[0].id);
};

export const verifierUserExistantRegister = async (email) => {
  const resultat = await sql.query(`SELECT id FROM users WHERE email = $1`, [
    email,
  ]);

  return resultat.length > 0;
};

export const verifierUserExistantLogin = async (email, password) => {
  const resultat = await sql.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (resultat.length === 0) {
    throw new Error("Utilisateur non trouvé");
  }
  const passBdd = resultat[0].password;

  return await compare(password, passBdd);
};

export const signAccessToken = (utilisateur) => {
  return sign(
    {
      id: utilisateur.id,
    },
    process.env.SECRET,
    {
      expiresIn: "15m",
      algorithm: "HS256",
    },
  );
};

export const signRefreshToken = (utilisateur) => {
  return sign(
    {
      id: utilisateur.id,
    },
    process.env.SECRETREFRESH,
    {
      expiresIn: "30d",
      algorithm: "HS256",
    },
  );
};

export const verifierAccessToken = (accessToken) => {
  return verify(accessToken, process.env.SECRET, {
    algorithms: ["HS256"],
  });
};

export const verifierRefreshToken = async (refreshToken) => {
  try {
    const payload = verify(
      refreshToken,
      process.env.SECRETREFRESH,
      {
        algorithms: ["HS256"],
      },
    );

    if (!payload?.id) {
      const erreur = new Error(
        "Identifiant utilisateur absent du refresh token",
      );

      erreur.status = 401;
      throw erreur;
    }

    const utilisateur =
      await recupererUtilisateurPourAutorisation(
        payload.id,
      );

    if (!utilisateur) {
      const erreur = new Error(
        "Utilisateur inexistant",
      );

      erreur.status = 401;
      throw erreur;
    }

    const accessToken =
      signAccessToken(utilisateur);

    return {
      accessToken,
      user: utilisateur,
    };
  } catch (error) {
    if (error.status === 401) {
      throw error;
    }

    if (error.name === "TokenExpiredError") {
      const erreur = new Error(
        "Refresh token expiré",
      );

      erreur.status = 401;
      throw erreur;
    }

    if (error.name === "JsonWebTokenError") {
      const erreur = new Error(
        "Refresh token invalide",
      );

      erreur.status = 401;
      throw erreur;
    }

    throw error;
  }
};

export const assignPointed = async (id, dateJour, pointedAt) => {
  const pointage = await recupererPointages(id, dateJour);

  if (!pointage) {
    const result = await sql.query(
      `
  INSERT INTO pointages (
    user_id,
    date_jour,
    arrival_pointed_at
  )
  VALUES ($1, $2, $3)

  ON CONFLICT (user_id, date_jour)
  DO UPDATE SET
    arrival_pointed_at = COALESCE(
      pointages.arrival_pointed_at,
      EXCLUDED.arrival_pointed_at
    )

  RETURNING *
  `,
      [id, dateJour, pointedAt],
    );

    return result[0];
  }

  if (!pointage.arrival_pointed_at) {
    const result = await sql.query(
      `
      UPDATE pointages
      SET arrival_pointed_at = $1
      WHERE user_id = $2 AND date_jour = $3
      RETURNING *
      `,
      [pointedAt, id, dateJour],
    );
    return result[0];
  }

  if (!pointage.start_pause_pointed_at) {
    const result = await sql.query(
      `
      UPDATE pointages
      SET start_pause_pointed_at = $1
      WHERE user_id = $2 AND date_jour = $3
      RETURNING *
      `,
      [pointedAt, id, dateJour],
    );
    return result[0];
  }

  if (!pointage.end_pause_pointed_at) {
    const result = await sql.query(
      `
      UPDATE pointages
      SET end_pause_pointed_at = $1
      WHERE user_id = $2 AND date_jour = $3
      RETURNING *
      `,
      [pointedAt, id, dateJour],
    );
    return result[0];
  }

  if (!pointage.departure_pointed_at) {
    const result = await sql.query(
      `
      UPDATE pointages
      SET departure_pointed_at = $1
      WHERE user_id = $2 AND date_jour = $3
      RETURNING *
      `,
      [pointedAt, id, dateJour],
    );
    return result[0];
  }

  return pointage;
};

export const recupererPointages = async (userId, dateJour) => {
  const result = await sql.query(
    `
    SELECT *
    FROM pointages
    WHERE user_id = $1 AND date_jour = $2
    `,
    [userId, dateJour],
  );

  return result[0] ?? null;
};

export const recupPointages = async (id, dateJour) => {
  const recup = await sql.query(
    `
    SELECT * 
    FROM pointages
    WHERE user_id = $1 AND date_jour = $2
    `,
    [id, dateJour],
  );
  return recup[0];
};

// export const recupHeureEmbauche = async (agence_id)=>{
//   const recup = await sql.query(`
//     SELECT heure_embauche
//     FROM agences
//     WHERE
//     `,[])
// }
export const recupererUtilisateurPourAutorisation = async (id) => {
  const result = await sql.query(
    `
      SELECT
        users.id,
        users.email,
        users.role_id,
        users.nom,
        users.prenom,
        users.birth,
        users.phone,
        users.created_at,
        users.avatar_img_url,

        roles.libelle AS role_libelle,
        roles.code AS role_code,

        agences.id AS agence_id,
        agences.nom AS agence_nom,
        agences.nom_complet AS agence_nom_complet,

        permissions.code AS permission_code

      FROM users

      LEFT JOIN roles
        ON roles.id = users.role_id

      LEFT JOIN users_agences
        ON users_agences.user_id = users.id
        AND users_agences.est_principale = TRUE

      LEFT JOIN agences
        ON agences.id = users_agences.agence_id

      LEFT JOIN role_permissions
        ON role_permissions.role_id = roles.id

      LEFT JOIN permissions
        ON permissions.id = role_permissions.permission_id
        AND permissions.actif = TRUE

      WHERE users.id = $1
    `,
    [id],
  );

  if (!result[0]) {
    return null;
  }

  const user = result[0];

  return {
    id: user.id,
    email: user.email,

    role_id: user.role_id,
    role: user.role_libelle,
    role_code: user.role_code,

    agence_id: user.agence_id,
    agence_nom: user.agence_nom,
    agence_nom_complet: user.agence_nom_complet,

    nom: user.nom,
    prenom: user.prenom,
    birth: user.birth,
    phone: user.phone,
    creeLe: user.created_at,
    avatar: user.avatar_img_url,

    permissions: [
      ...new Set(result.map((ligne) => ligne.permission_code).filter(Boolean)),
    ],
  };
};
