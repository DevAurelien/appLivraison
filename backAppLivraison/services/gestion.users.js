import fs from "fs/promises";
import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import "dotenv/config";
import {roles} from "../models/role.js"

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
  const chiffreId = fichierParse.reduce((max, el) => (el.id > max ? el.id : max), 0);
  fichierParse.push({ id: chiffreId + 1, email, password: pass, role:"client" });
  await fs.writeFile(USERS_FILE, JSON.stringify(fichierParse, null, 4), "utf-8");
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

export const signerJwt = async (email) => {
  const secret = process.env.SECRET;
  if (!secret) {
    throw new Error("La variable env secrete est manquante");
  }

  const fichierParse = JSON.parse(await fs.readFile(USERS_FILE, "utf-8"));
  const userTrouver = fichierParse.find((el) => el.email === email);
  if (!userTrouver) {
    throw new Error("Utilisateur introuvable");
  }

  return sign({ id: userTrouver.id, email: userTrouver.email }, secret);
};
