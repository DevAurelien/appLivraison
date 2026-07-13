import { verifierAccessToken } from "../services/gestion.users.js";

export const verifierAuthentification = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token manquant",
      });
    }

    const accessToken = authorization.split(" ")[1];

    const tokenValide = await verifierAccessToken(accessToken);

    req.user = tokenValide;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Access token invalide ou expiré",
    });
  }
};