import {
  creerUser,
  verifierUserExistant,
  signAccessToken,
  signRefreshToken,
  verifierRefreshToken,
} from "../services/gestion.users.js";

export const ControlLoginUsers = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  if (email === "" || password === "") {
    return res
      .status(400)
      .json({ message: "Le mot de passe ou le mail sont incorrects" });
  }
  password = password.toLowerCase();

  const verifierUtilisateur = await verifierUserExistant(email, password);
  if (!verifierUtilisateur) {
    await creerUser(email, password);
  }

  if (verifierUtilisateur) {
    try {
      const accessToken = await signAccessToken(email);
      const refreshToken = await signRefreshToken(email);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        couleur: "vert",
        message: "Connection Réussie",
        accessToken,
      });
    } catch (e) {
      return res.status(500).json({ message: `${e}, une erreur s'est produite` });
    }
  }
};

export const ControlRegisterUsers = async (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  if (email === "" || password === "") {
    return res
      .status(400)
      .json({ message: "Le mot de passe ou le mail sont incorrects" });
  }
  password = password.toLowerCase();

  let verifierUtilisateur = await verifierUserExistant(email, password);
  if (verifierUtilisateur) {
    return res.status(400).json({ message: "Ce mail est déjà utilisé" });
  }

  await creerUser(email, password);
  try {
    const accessToken = await signAccessToken(email);
    const refreshToken = await signRefreshToken(email);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      couleur: "vert",
      message: "Utilisateur Crée",
      accessToken,
    });
  } catch (e) {
    return res.status(500).json({ message: `${e}, une erreur s'est produite` });
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
