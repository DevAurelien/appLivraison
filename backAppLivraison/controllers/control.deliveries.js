import { recupererLivraisons } from "../services/gestion.deliveries.js";
import { signAccessToken, verifierAccessToken, verifierRefreshToken } from "../services/gestion.users.js";

export const controlRecupDeliveries = async (
  req,
  res,
) => {
  try {
    const livraisons =
      await recupererLivraisons();

    return res.status(200).json(livraisons);
  } catch (error) {
    console.error(
      "Erreur récupération livraisons :",
      error,
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};