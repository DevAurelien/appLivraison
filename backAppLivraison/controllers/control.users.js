import {
  creerUser,
  loginUser,
  signAccessToken,
  signRefreshToken,
  verifierRefreshToken,
} from "../services/gestion.users.js";

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

  try {
    const user = await creerUser(email, password);

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
