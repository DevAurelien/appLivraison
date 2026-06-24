import { recupererLivraisons } from "../services/gestion.deliveries.js";
import { signAccessToken, verifierAccessToken, verifierRefreshToken } from "../services/gestion.users.js";

export const controlRecupDeliveries = async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    await verifierAccessToken(token);
  } catch (e) {
    console.error(e);

    if (e.name === "TokenExpiredError") {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token manquant", deco:true});
      }

      try {
        const { accessToken } = await verifierRefreshToken(refreshToken);
        const id = req.params?.id;
        const jsonPret = id
          ? await recupererLivraisons(id)
          : await recupererLivraisons();
        return res.status(200).json({ accessToken, data: jsonPret });
      } catch (refreshError) {
        console.error(refreshError);
        return res
          .status(refreshError.status || 401)
          .json({ error: refreshError.message });
      }
    }

    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Access token invalide", deco:true });
    }

    return res
      .status(500)
      .json({ error: "Une erreur est survenue dans la recuperation" });
  }

  const id = req.params?.id;
  const jsonPret = id
    ? await recupererLivraisons(id)
    : await recupererLivraisons();
  return res.status(200).json(jsonPret);
};