import fs from "fs/promises";
import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign, decode, verify } = pkg;
import "dotenv/config";
import { roles } from "../models/role.js";

const USERS_FILE = "./users.json";

export const creerUser = async (email, password) => {
  let fichierParse = [];
  try {
    fichierParse = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    }
  }

  const pass = await hash(password, 10);
  const chiffreId = fichierParse.reduce(
    (max, el) => (el.id > max ? el.id : max),
    0,
  );
  fichierParse.push({
    id: chiffreId + 1,
    email,
    password: pass,
    role: "client",
  });
  await fs.writeFile(
    USERS_FILE,
    JSON.stringify(fichierParse, null, 4),
    "utf-8",
  );
};

export const verifierUserExistant = async (email, password) => {
  let fichierParse = [];
  try {
    fichierParse = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  } catch (e) {
    if (e.code === "ENOENT") {
      return false;
    }
    throw e;
  }

  const userTrouver = fichierParse.find((el) => el.email === email);
  if (!userTrouver) {
    return false;
  }

  return compare(password, userTrouver.password);
};

export const signAccessToken = async (email) => {
  const fichierParse = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  const userTrouver = fichierParse.find((el) => el.email === email);
  if (!userTrouver) {
    throw new Error("Utilisateur introuvable");
  }
  const data = {
    id: userTrouver.id,
    email: userTrouver.email,
    role: userTrouver.role ?? "Client",
  };

  return sign(data, process.env.SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = async (email) => {
  const fichierParse = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  const userTrouver = fichierParse.find((el) => el.email === email);
  if (!userTrouver) {
    throw new Error("Utilisateur introuvable");
  }
  const data = {
    id: userTrouver.id,
    email: userTrouver.email,
  };

  return sign(data, process.env.SECRETREFRESH, { expiresIn: "1h" });
};

export const verifierAccessToken = async(accessToken)=>{
  
  try{
  const tokenValide = verify(accessToken);
  }catch(e){
    throw new Error("Token access invalide");
  }
  return tokenValide;
}


export const verifierRefreshToken = async (refreshToken) => {
  try {
    const tokenVerifier = verify(refreshToken, process.env.SECRETREFRESH);
    const accessToken = await signAccessToken(tokenVerifier.email);
    return { accessToken, email: tokenVerifier.email };
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
