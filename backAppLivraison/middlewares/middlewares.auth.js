import { verifierAccessToken } from "../services/gestion.users.js";
import { recupererUtilisateurPourAutorisation } from "../services/gestion.users.js";

export const verifierAuthentification = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token manquant",
      });
    }

    const accessToken = authorization.slice(7);

    const payload = verifierAccessToken(accessToken);

    if (!payload?.id) {
      return res.status(401).json({
        message: "Access token incomplet",
      });
    }

    const utilisateur = await recupererUtilisateurPourAutorisation(payload?.id);

    if (!utilisateur) {
      return res.status(401).json({
        message: "Utilisateur inexistant",
      });
    }

    req.user = utilisateur;

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Erreur de base de données",
    });
  }
};

// export const actualiserUtilisateurAuthentifie = async (req, res, next) => {
//   try {
//     const utilisateur = await recupererUtilisateurPourAutorisation(req.user.id);

//     if (!utilisateur) {
//       return res.status(401).json({
//         message: "Utilisateur inexistant",
//       });
//     }

//     req.user = utilisateur;

//     next();
//   } catch (error) {
//     console.error("Erreur autorisation :", error);

//     return res.status(500).json({
//       message: "Erreur pendant la vérification des autorisations",
//     });
//   }
// };

export const autoriserRoles = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({
        message: "Vous n'avez pas l'autorisation d'effectuer cette action",
      });
    }

    next();
  };
};

// todo modifier la route auth et auto