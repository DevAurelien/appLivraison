import { sql } from "../database/db.js";

export const recupererIndicateursAdministration = async () => {
  const resultat = await sql.query(
    `WITH date_locale AS (
      SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Paris')::date AS aujourd_hui
    )
    SELECT
      (SELECT COUNT(*) FROM users u JOIN roles r ON r.id = u.role_id
       WHERE u.salarie = TRUE AND r.code NOT IN ('CLIENT', 'MAGASIN', 'GM'))::integer AS salaries_total,
      (SELECT COUNT(DISTINCT p.user_id)
       FROM pointages p JOIN users u ON u.id = p.user_id
       JOIN roles r ON r.id = u.role_id, date_locale d
       WHERE u.salarie = TRUE AND p.date_jour = d.aujourd_hui
         AND r.code NOT IN ('CLIENT', 'MAGASIN', 'GM')
         AND p.arrival_pointed_at IS NOT NULL)::integer AS salaries_actifs,
      (SELECT COUNT(*) FROM agences)::integer AS agences_total,
      (SELECT COUNT(*) FROM agences a
       WHERE EXISTS (SELECT 1 FROM camions c WHERE c.agence_id = a.id)
         AND EXISTS (
           SELECT 1 FROM users_agences ua
           JOIN users u ON u.id = ua.user_id
           JOIN roles r ON r.id = u.role_id
           WHERE ua.agence_id = a.id AND ua.est_principale = TRUE
             AND u.salarie = TRUE AND r.code IN ('LIVREUR', 'CHEF_CAMION')
         ))::integer AS agences_actives,
      (SELECT COUNT(*) FROM camions)::integer AS camions_total,
      (SELECT COUNT(*) FROM camions WHERE UPPER(statut) = 'DISPONIBLE')::integer AS camions_disponibles,
      (SELECT COUNT(*) FROM secteurs)::integer AS secteurs_total,
      (SELECT COUNT(*) FROM secteurs WHERE actif = TRUE)::integer AS secteurs_actifs,
      (SELECT COUNT(*) FROM tournees t, date_locale d
       WHERE t.date_tournee = d.aujourd_hui)::integer AS tournees_total_jour,
      (SELECT COUNT(*) FROM tournees t, date_locale d
       WHERE t.date_tournee = d.aujourd_hui
         AND UPPER(t.statut) IN ('TERMINEE', 'TERMINÉE', 'LIVREE', 'LIVRÉE'))::integer
         AS tournees_realisees,
      0::integer AS incidents_ouverts,
      TRUE AS statistiques_a_jour,
      CURRENT_TIMESTAMP AS statistiques_verifiees_le`,
  );
  return resultat[0];
};

export const recupererChiffreAffairesAgences = async (periode = "mois") => {
  const periodes = {
    mois: { debut: "date_trunc('month', d.aujourd_hui)::date", precedent: "(date_trunc('month', d.aujourd_hui) - INTERVAL '1 month')::date" },
    annee: { debut: "date_trunc('year', d.aujourd_hui)::date", precedent: "(date_trunc('year', d.aujourd_hui) - INTERVAL '1 year')::date" },
    "30j": { debut: "(d.aujourd_hui - INTERVAL '29 days')::date", precedent: "(d.aujourd_hui - INTERVAL '59 days')::date" },
  };
  const choix = periodes[periode] || periodes.mois;

  const agences = await sql.query(`
    WITH date_locale AS (
      SELECT (CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Paris')::date AS aujourd_hui
    ), bornes AS (
      SELECT ${choix.debut} AS debut,
        (d.aujourd_hui + INTERVAL '1 day')::date AS fin,
        ${choix.precedent} AS debut_precedent
      FROM date_locale d
    )
    SELECT a.id, a.nom, a.nom_complet,
      COALESCE(SUM(ca.montant_centimes) FILTER (
        WHERE ca.date_jour >= b.debut AND ca.date_jour < b.fin
      ), 0)::bigint AS montant_centimes,
      COALESCE(SUM(ca.montant_centimes) FILTER (
        WHERE ca.date_jour >= b.debut_precedent AND ca.date_jour < b.debut
      ), 0)::bigint AS montant_precedent_centimes,
      COUNT(ca.id) FILTER (
        WHERE ca.date_jour >= b.debut AND ca.date_jour < b.fin
      )::integer AS jours_renseignes,
      b.debut, (b.fin - INTERVAL '1 day')::date AS fin,
      MAX(ca.created_at) AS derniere_mise_a_jour
    FROM agences a CROSS JOIN bornes b
    LEFT JOIN chiffres_affaires_agences ca ON ca.agence_id = a.id
      AND ca.date_jour >= b.debut_precedent AND ca.date_jour < b.fin
    GROUP BY a.id, a.nom, a.nom_complet, b.debut, b.fin
    ORDER BY montant_centimes DESC, a.nom
  `);

  const normalisees = agences.map((agence) => ({
    ...agence,
    montant_centimes: Number(agence.montant_centimes),
    montant_precedent_centimes: Number(agence.montant_precedent_centimes),
  }));
  return {
    periode,
    debut: normalisees[0]?.debut ?? null,
    fin: normalisees[0]?.fin ?? null,
    montant_total_centimes: normalisees.reduce((total, agence) => total + agence.montant_centimes, 0),
    montant_precedent_total_centimes: normalisees.reduce((total, agence) => total + agence.montant_precedent_centimes, 0),
    agences: normalisees,
  };
};

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
    WHERE r.code IS DISTINCT FROM 'GM'
      AND (u.email ILIKE $1 OR u.nom ILIKE $1 OR u.prenom ILIKE $1
        OR CONCAT(u.prenom, ' ', u.nom) ILIKE $1)
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
  if (cible.role_code === "GM") return { erreur: "Utilisateur introuvable", statut: 404 };
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
