import { sql } from "../database/db.js";

export const rechercherUtilisateursAdministration = async (saisie) => {
  const terme = `%${saisie.trim()}%`;
  return sql.query(
    `SELECT u.id, u.email, u.nom, u.prenom, u.salarie,
      r.id AS role_id, r.code AS role_code, r.libelle AS role,
      r.ordre_affichage, a.nom AS agence_nom
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    LEFT JOIN users_agences ua ON ua.user_id = u.id AND ua.est_principale = TRUE
    LEFT JOIN agences a ON a.id = ua.agence_id
    WHERE u.email ILIKE $1 OR u.nom ILIKE $1 OR u.prenom ILIKE $1
      OR CONCAT(u.prenom, ' ', u.nom) ILIKE $1
    ORDER BY u.nom, u.prenom
    LIMIT 30`,
    [terme],
  );
};

export const listerRolesAdministrables = (auteurId) => sql.query(
  `SELECT candidat.id, candidat.code, candidat.libelle,
     candidat.service, candidat.ordre_affichage
   FROM users auteur
   JOIN roles role_auteur ON role_auteur.id = auteur.role_id
   JOIN roles candidat ON candidat.actif = TRUE
   WHERE auteur.id = $1
     AND candidat.code <> 'GM'
     AND (role_auteur.code = 'GM'
       OR candidat.ordre_affichage < role_auteur.ordre_affichage)
   ORDER BY candidat.ordre_affichage, candidat.libelle`,
  [auteurId],
);

export const modifierRoleUtilisateur = async (auteurId, cibleId, roleId, motif) => {
  const personnes = await sql.query(
    `SELECT u.id, u.role_id, r.code AS role_code, r.libelle AS role,
      r.ordre_affichage
    FROM users u LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.id = ANY($1::int[])`,
    [[auteurId, cibleId]],
  );
  const auteur = personnes.find((personne) => personne.id === auteurId);
  const cible = personnes.find((personne) => personne.id === cibleId);
  const nouveauRole = (await sql.query(
    `SELECT id, code, libelle, ordre_affichage FROM roles WHERE id = $1 AND actif = TRUE`,
    [roleId],
  ))[0];

  if (!auteur || !cible) return { erreur: "Utilisateur introuvable", statut: 404 };
  if (!nouveauRole) return { erreur: "Rôle introuvable ou inactif", statut: 404 };
  if (nouveauRole.code === "GM") {
    return { erreur: "Le rôle Super administrateur ne peut pas être attribué depuis cette interface", statut: 403 };
  }
  if (auteurId === cibleId) return { erreur: "Vous ne pouvez pas modifier votre propre rôle", statut: 403 };
  if (cible.role_id === nouveauRole.id) return { erreur: "Cet utilisateur possède déjà ce rôle", statut: 409 };

  const superAdministrateur = auteur.role_code === "GM";
  if (!superAdministrateur && (
    cible.role_code === "GM"
    || Number(cible.ordre_affichage) >= Number(auteur.ordre_affichage)
    || nouveauRole.code === "GM"
    || Number(nouveauRole.ordre_affichage) >= Number(auteur.ordre_affichage)
  )) {
    return { erreur: "Vous ne pouvez gérer que des rôles strictement inférieurs au vôtre", statut: 403 };
  }

  const resultat = await sql.query(
    `WITH modification AS (
      UPDATE users
      SET role_id = $3,
          role = $4,
          salarie = CASE WHEN $5 IN ('CLIENT', 'MAGASIN') THEN FALSE ELSE TRUE END
      WHERE id = $2
      RETURNING id, nom, prenom, email, salarie, role_id
    ), journal AS (
      INSERT INTO journal_roles_utilisateurs
        (auteur_id, utilisateur_id, ancien_role_id, nouveau_role_id, motif)
      SELECT $1, $2, $6, $3, $7 FROM modification
    )
    SELECT m.*, $4::text AS role, $5::text AS role_code
    FROM modification m`,
    [auteurId, cibleId, nouveauRole.id, nouveauRole.libelle, nouveauRole.code, cible.role_id, motif],
  );
  return { donnees: resultat[0] };
};
