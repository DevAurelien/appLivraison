import {
  creerUser,
  loginUser,
  signAccessToken,
  signRefreshToken,
  verifierRefreshToken,
  verifierAccessToken,
  assignPointed,
  recupPointages
} from "../services/gestion.users.js";
import { put } from "@vercel/blob";
import { get } from "@vercel/blob";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { sql } from "../database/db.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
const cookieOptionsClear = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export const ControlAssignPointed = async (req, res) => {
  try {
    const id = req.user.id;
    const pointedAt = new Date();
    const dateJour = pointedAt.toISOString().split("T")[0];
    const pointage = await assignPointed(id, dateJour, pointedAt);
    return res.status(201).json(pointage);
  }catch (error) {
  console.error("Erreur assignPointed :", error);

  return res.status(500).json({
    erreur: error.message,
    code: error.code,
  });
}
};

export const ControlRecupPointed = async(req, res)=>{
  try {
    const id = req.user.id;
    const date = new Date();
    const dateJour = date.toISOString().split("T")[0];
    const pointages = await recupPointages(id, dateJour);
    if(!pointages) return res.status(404).json({données:"Aucun pointage effectué aujourdhui"})
    return res.status(201).json(pointages)
  }catch(error){
    console.log(error)
  }
}

export const ControlRegisterUsers = async (req, res) => {
  try {
    let {
      email,
      password,
      nom,
      prenom,
      birth,
      phone,
      avatar_img_url,
    } = req.body;

    if (
      !email?.trim() ||
      !password?.trim() ||
      !nom?.trim() ||
      !prenom?.trim() ||
      !birth?.trim() ||
      !phone?.trim()
    ) {
      return res.status(400).json({
        couleur: "rouge",
        message: "Veuillez remplir tous les champs",
        ok: false,
      });
    }

    email = email.trim().toLowerCase();
    password = password.trim();
    nom = nom.trim();
    prenom = prenom.trim();
    birth = birth.trim();
    phone = phone.trim();

    const user = await creerUser(
      email,
      password,
      nom,
      prenom,
      birth,
      phone,
      avatar_img_url,
    );

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie(
      "refreshToken",
      refreshToken,
      cookieOptions,
    );

    return res.status(201).json({
      couleur: "vert",
      message: "Utilisateur créé",
      data: user,
      accessToken,
      ok: true,
    });
  } catch (error) {
    console.error(
      "Erreur inscription :",
      error,
    );

    return res
      .status(error.status || 500)
      .json({
        couleur: "rouge",
        message:
          error.message ||
          "Une erreur s'est produite pendant l'inscription",
        ok: false,
      });
  }
};

export const ControlLoginUsers = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    if (email === "" || password === "") {
      return res.status(400).json({
        couleur: "rouge",
        message: "Le mot de passe ou le mail sont incorrects",
        ok: false,
      });
    }
    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await loginUser(email, password);
    if (user) {
      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      res.cookie("refreshToken", refreshToken, cookieOptions);
      return res.json({
        couleur: "vert",
        message: "Connection Réussie",
        data: user,
        accessToken,
        ok: true,
      });
    }
  } catch (e) {
    return res.status(500).json({
      couleur: "rouge",
      message: `${e}, une erreur s'est produite`,
      ok: false,
    });
  }
};

export const ControlRefreshUsers = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        couleur: "rouge",
        message: "Refresh token manquant",
        ok: false,
      });
    }

    const resultatRefresh =
      await verifierRefreshToken(refreshToken);

    const accessToken =
      resultatRefresh.accessToken;

    const user =
      resultatRefresh.user;

    return res.status(200).json({
      couleur: "vert",
      message: "Session restaurée",
      data: user,
      accessToken,
      ok: true,
    });
  } catch (error) {
    res.clearCookie(
      "refreshToken",
      cookieOptionsClear,
    );

    return res.status(error.status || 401).json({
      couleur: "rouge",
      message:
        error.message ||
        "Session expirée ou invalide",
      ok: false,
    });
  }
};

export const ControlLogoutUsers = async (req, res) => {
  res.clearCookie("refreshToken", cookieOptionsClear);

  return res.status(200).json({
    message: "Déconnexion réussie",
    ok: true,
  });
};

export const controlImageProfil = async (req, res) => {
  try {
    const fichier = req.file;

    if (!fichier) {
      return res.status(400).json({
        error: "Aucune image reçue",
      });
    }

    const extensionsAutorisees = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = extensionsAutorisees[fichier.mimetype];

    if (!extension) {
      return res.status(400).json({
        error:
          "Format d'image non autorisé. Utilisez JPG, PNG ou WEBP.",
      });
    }

    const tailleMax = 2 * 1024 * 1024;

    if (fichier.size > tailleMax) {
      return res.status(400).json({
        error: "L'image dépasse 2 Mo",
      });
    }

    const pathname = `avatars/avatar-${Date.now()}.${extension}`;

    const blob = await put(
      pathname,
      fichier.buffer,
      {
        access: "private",
        contentType: fichier.mimetype,
        addRandomSuffix: true,

        
        token: process.env.BLOB_READ_WRITE_TOKEN,
      },
    );

    return res.status(201).json({
      message: "Avatar enregistré avec succès",
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: fichier.size,
    });
  } catch (error) {
    console.error(
      "Erreur pendant l'upload de l'avatar :",
      error,
    );

    return res.status(500).json({
      error:
        error.message ||
        "Impossible d'enregistrer l'image",
    });
  }
};

export const controlAfficherAvatar = async (req, res) => {
  try {
    
    const avatarUrl =
      req.user?.avatar ??
      req.user?.avatar_img_url;

    if (!avatarUrl) {
      return res.status(404).json({
        message: "Aucun avatar trouvé",
      });
    }

   
    const etagNavigateur =
      req.headers["if-none-match"];

    const resultatBlob = await get(avatarUrl, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,

      ifNoneMatch:
        typeof etagNavigateur === "string"
          ? etagNavigateur
          : undefined,
    });

    if (!resultatBlob) {
      return res.status(404).json({
        message: "Le fichier de l’avatar est introuvable",
      });
    }

    res.setHeader(
      "Cache-Control",
      "private, no-cache",
    );

    res.setHeader(
      "ETag",
      resultatBlob.blob.etag,
    );

    res.setHeader(
      "Vary",
      "Authorization",
    );

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff",
    );

   
    if (resultatBlob.statusCode === 304) {
      return res.status(304).end();
    }

    if (
      resultatBlob.statusCode !== 200 ||
      !resultatBlob.stream
    ) {
      return res.status(404).json({
        message: "Avatar indisponible",
      });
    }

    res.setHeader(
      "Content-Type",
      resultatBlob.blob.contentType ||
        "application/octet-stream",
    );

    await pipeline(
      Readable.fromWeb(resultatBlob.stream),
      res,
    );
  } catch (error) {
    console.error(
      "Erreur pendant l’affichage de l’avatar :",
      error,
    );

    if (res.headersSent) {
      return res.end();
    }

    return res.status(500).json({
      message: "Impossible de charger l’avatar",
    });
  }
};