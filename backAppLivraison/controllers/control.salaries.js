import {
  recupSalaries,
  recupImgSalaries,
} from "../services/gestion.salaries.js";
import { get } from "@vercel/blob";
import { Readable } from "node:stream";
import { sql } from "../database/db.js";

export const controlRecupSalaries = async (req, res) => {
  const saisie = req.query.saisie;
  const user = req.user;
if (user.role === "Client") {
  return res.status(403).json({
    message: "Accès interdit",
  });
}  const salaries = await recupSalaries(saisie, user.id);
  res.status(200).json({ salaries });
  // res.status(200).json({salaries:[{},{}],})
};


export const controlAfficherAvatarSalarie = async (req, res) => {
  try {
    const salarieId = req.params.id;

    const avatarUrl = await recupImgSalaries(salarieId);

    if (!avatarUrl) {
      return res.status(404).json({
        message: "Aucun avatar trouvé pour ce salarié",
      });
    }

    const pathname = new URL(avatarUrl).pathname.slice(1);

    const resultatBlob = await get(pathname, {
      access: "private",
      oidcToken: process.env.VERCEL_OIDC_TOKEN,
      storeId: process.env.BLOB_STORE_ID,
    });

    res.setHeader("Content-Type", resultatBlob.blob.contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");

    Readable.fromWeb(resultatBlob.stream).pipe(res);
  } catch (error) {
    console.error("Erreur affichage avatar salarié :", error);

    return res.status(500).json({
      message: "Impossible de charger l'avatar du salarié",
    });
  }
};