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
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expiré",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Access token invalide",
      });
    }

    console.error("ERREUR VÉRIFICATION AUTHENTIFICATION :", error);

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

export const autoriserPermissions = (...permissionsRequises) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifie",
      });
    }

    const permissionsUtilisateur = Array.isArray(req.user.permissions)
      ? req.user.permissions
      : [];

    const permissionsManquantes = permissionsRequises.filter(
      (permission) => !permissionsUtilisateur.includes(permission),
    );

    if (permissionsManquantes.length) {
      return res.status(403).json({
        message: "Vous n'avez pas l'autorisation d'effectuer cette action",
        permissions_manquantes: permissionsManquantes,
      });
    }

    next();
  };
};

export const autoriserUneDesPermissions = (...permissionsAutorisees) => {
  return (req, res, next) => {
    const permissions = Array.isArray(req.user?.permissions) ? req.user.permissions : [];
    if (!req.user) return res.status(401).json({ message: "Utilisateur non authentifié" });
    if (!permissionsAutorisees.some((permission) => permissions.includes(permission))) {
      return res.status(403).json({ message: "Vous n'avez pas l'autorisation d'effectuer cette action" });
    }
    next();
  };
};

export const autoriserPermissionOuRoles = (permissionRequise, ...rolesAutorises) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }

      // Recharge les droits depuis la BDD : le contenu éventuel du token ne fait
      // jamais autorité pour une action d'administration sensible.
      const utilisateur = await recupererUtilisateurPourAutorisation(req.user.id);
      if (!utilisateur) {
        return res.status(401).json({ message: "Utilisateur inexistant" });
      }
      req.user = utilisateur;

      const autoriseParPermission = utilisateur.permissions.includes(permissionRequise);
      const autoriseParRole = rolesAutorises.includes(utilisateur.role_code);
      if (!autoriseParPermission && !autoriseParRole) {
        return res.status(403).json({
          message: "Permission spéciale ou rôle habilité requis",
        });
      }
      next();
    } catch (error) {
      console.error("ERREUR CONTRÔLE AUTORISATION SENSIBLE :", error);
      return res.status(500).json({ message: "Vérification des autorisations impossible" });
    }
  };
};

export const interdireRoles = (...rolesInterdits) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Utilisateur non authentifié" });
    if (rolesInterdits.includes(req.user.role_code)) {
      return res.status(403).json({ message: "Ce type de compte n'a pas accès à l'administration" });
    }
    next();
  };
};

// todo modifier la route auth et auto
