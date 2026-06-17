import fs from "fs/promises";
import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import "dotenv/config";

export const creerUser = async (email, password) => {
  let fichierParse;
  try {
    fichierParse = JSON.parse(await fs.readFile("./users.json", "utf-8"));
    let pass = await hash(password, 10);
    let chiffreId = 0;
    for (const el of fichierParse) {
      if (el.id > chiffreId) {
        chiffreId = el.id;
      }
    }
    fichierParse = [
      ...fichierParse,
      { id: chiffreId + 1, email: email, password: pass },
    ];
    const fichierParseJSon = JSON.stringify(fichierParse, null, 4);
    await fs.writeFile("./users.json", fichierParseJSon);
  } catch (e) {
    if (e.code === "ENOENT") {
      fichierParse = [];
    }
  }
};

export const verifierUser = async (email, password) => {
  let fichierParse = JSON.parse(await fs.readFile("./users.json", "utf-8"));
  let userTrouver = fichierParse.find((el) => el.email === email);
  if (!userTrouver) {
    return false;
  }
  let userVerifier = await compare(password, userTrouver.password);
  if (userVerifier) return true;
  else return false;
};

export const signerJwt = async (email, password) => {
  let fichierParse = JSON.parse(await fs.readFile("./users.json", "utf-8"));
  let userTrouver = fichierParse.find((el) => el.email === email);
  const signer = await sign(userTrouver, process.env.SECRET);
  console.log(signer);
};
