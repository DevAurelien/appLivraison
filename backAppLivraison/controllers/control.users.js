import {
  creerUser,
  loginUser,
  signAccessToken,
  signRefreshToken,
  verifierRefreshToken,
} from "../services/gestion.users.js";
import { put } from "@vercel/blob";


export const ControlLoginUsers = async (req, res) => {
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
    try {
      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        couleur: "vert",
        message: "Connection Réussie",
        data: user,
        accessToken,
        ok: true,
      });
    } catch (e) {
      return res.status(500).json({
        couleur: "rouge",
        message: `${e}, une erreur s'est produite`,
        ok: false,
      });
    }
  }
};

export const ControlRegisterUsers = async (req, res) => {
  let { email, password, nom, prenom, birth, phone } = req.body;
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
  nom = nom.trim();
  prenom = prenom.trim();
  birth = birth.trim();
  phone = phone.trim();

  try {
    const user = await creerUser(email, password, nom, prenom, birth, phone);

    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      couleur: "vert",
      message: "Utilisateur Crée",
      data: user,
      accessToken,
      ok: true,
    });
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
      return res.status(401).json({ error: "Refresh token manquant" });
    }
    const refreshTokenValide = await verifierRefreshToken(refreshToken);
    const accessToken = refreshTokenValide.accessToken;
    return res.status(200).json({ accessToken });
  } catch (e) {
    res.clearCookie("refreshToken");
    return res.status(e.status || 401).json({ error: e.message });
  }
};



export const controlImageProfil = async (req, res) => {
  try {
    const fichier = req.file;

    if (!fichier) {
      return res.status(400).json({
        error: "Aucune image reçue",
      });
    }

    const typesAutorises = ["image/jpeg", "image/png", "image/webp"];

    if (!typesAutorises.includes(fichier.mimetype)) {
      return res.status(400).json({
        error: "Format d'image non autorisé",
      });
    }

    const tailleMax = 2 * 1024 * 1024;

    if (fichier.size > tailleMax) {
      return res.status(400).json({
        error: "L'image dépasse 2 Mo",
      });
    }

    const blob = await put(
      `avatars/${fichier.originalname}`,
      fichier.buffer,
      {
        access: "private",
        contentType: fichier.mimetype,
        addRandomSuffix: true,
      },
    );

    return res.status(201).json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: fichier.size,
    });
  } catch (error) {
    console.error("Erreur upload Blob :", error);

    return res.status(500).json({
      error: error.message || "Impossible d'enregistrer l'image",
    });
  }
};