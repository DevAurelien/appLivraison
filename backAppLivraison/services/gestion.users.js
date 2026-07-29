import fs from "fs/promises";
import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign, decode, verify } = pkg;
import "dotenv/config";
import { roles } from "../models/role.js";
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
  const userExiste = await verifierUserExistantRegister(email);

  if (userExiste) {
    throw new Error("Utilisateur déjà existant");
  }

  const pass = await hash(password, 10);
  const role = "Client";

  const userCree = await sql.query(
    `INSERT INTO users (email, password, role, nom, prenom, birth, phone, avatar_img_url)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   RETURNING id, email, role, created_at, nom, prenom, birth, phone, avatar_img_url`,
    [email, pass, role, nom, prenom, birth, phone, avatar_img_url],
  );

  const user = userCree[0];

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    creeLe: user.created_at,
    nom: user.nom,
    prenom: user.prenom,
    birth: user.birth,
    phone: user.phone,
    avatar: user.avatar_img_url,
  };
};

export const loginUser = async (email, password) => {
  const resultat = await sql.query(
    `SELECT id, email, password, role, created_at, nom, prenom, birth, phone, avatar_img_url FROM users WHERE email = $1`,
    [email],
  );

  if (resultat.length === 0) {
    throw new Error("Identifiants incorrects");
  }

  const user = resultat[0];

  const passwordOk = await compare(password, user.password);

  if (!passwordOk) {
    throw new Error("Identifiants incorrects");
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    creeLe: user.created_at,
    nom: user.nom,
    prenom: user.prenom,
    birth: user.birth,
    phone: user.phone,
    avatar: user.avatar_img_url,
  };
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

export const signAccessToken = (userTrouver) => {
  const data = {
    id: userTrouver.id,
    email: userTrouver.email,
    role: userTrouver.role ?? "Client",
    nom: userTrouver.nom,
    prenom: userTrouver.prenom,
    birth: userTrouver.birth,
    phone: userTrouver.phone,
    creeLe: userTrouver.creeLe,
    avatar: userTrouver.avatar,
  };

  return sign(data, process.env.SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = (userTrouver) => {
  const data = {
    id: userTrouver.id,
    email: userTrouver.email,
    role: userTrouver.role,
    nom: userTrouver.nom,
    prenom: userTrouver.prenom,
    birth: userTrouver.birth,
    phone: userTrouver.phone,
    creeLe: userTrouver.creeLe,
    avatar: userTrouver.avatar,
  };

  return sign(data, process.env.SECRETREFRESH, { expiresIn: "12h" });
};

export const verifierAccessToken = (accessToken) => {
  return verify(accessToken, process.env.SECRET, {
    algorithms: ["HS256"],
  });
};

export const verifierRefreshToken = async (refreshToken) => {
  try {
    const tokenVerifier = verify(refreshToken, process.env.SECRETREFRESH);

    const accessToken = await signAccessToken({
      id: tokenVerifier.id,
      email: tokenVerifier.email,
      role: tokenVerifier.role,
      nom: tokenVerifier.nom,
      prenom: tokenVerifier.prenom,
      birth: tokenVerifier.birth,
      phone: tokenVerifier.phone,
      creeLe: tokenVerifier.creeLe,
      avatar: tokenVerifier.avatar,
    });

    const user = {
      id: tokenVerifier.id,
      email: tokenVerifier.email,
      role: tokenVerifier.role,
      nom: tokenVerifier.nom,
      prenom: tokenVerifier.prenom,
      birth: tokenVerifier.birth,
      phone: tokenVerifier.phone,
      creeLe: tokenVerifier.creeLe,
      avatar: tokenVerifier.avatar,
    };

    return { accessToken, user };
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      const err = new Error("Refresh token expiré");
      err.status = 401;
      throw err;
    }

    if (e.name === "JsonWebTokenError") {
      const err = new Error("Refresh token invalide");
      err.status = 401;
      throw err;
    }

    throw e;
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

export const recupererUtilisateurPourAutorisation = async (id) => {
  const result = await sql.query(
    `
      SELECT id, role
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result[0] ?? null;
};