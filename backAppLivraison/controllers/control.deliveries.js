import { recupererLivraisons } from "../services/gestion.deliveries.js";
import { verifierAccessToken } from "../services/gestion.users.js";

export const controlRecupDeliveries = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    await verifierAccessToken(token);

    const id = req.params?.id;
    const jsonPret = id
      ? await recupererLivraisons(id)
      : await recupererLivraisons();
    return res.status(200).json(jsonPret);
  } catch (e) {
    console.error(e);
    if (e.name === "TokenExpiredError" || e.name === "JsonWebTokenError") {
      return res.status(401).json({ error: e.message });
    }
    return res.status(500).json({ error: "Une erreur est survenue dans la recuperation" });
  }
};
