import { sql } from "../database/db.js";

export const utilisateurPeutPublier = async (userId) => {
  const resultat = await sql.query(
    `SELECT auteur.id FROM users auteur JOIN roles ra ON ra.id = auteur.role_id
     LEFT JOIN roles coordinateur ON coordinateur.code = 'COORDINATEUR'
     WHERE auteur.id = $1 AND (ra.code = 'GM'
       OR (coordinateur.id IS NOT NULL AND ra.ordre_affichage >= coordinateur.ordre_affichage))`,
    [userId],
  );
  return Boolean(resultat[0]);
};

export const listerMessagesPourUtilisateur = (userId) => sql.query(
  `SELECT m.id, m.titre, m.contenu, m.cible_type, m.created_at,
    auteur.nom AS auteur_nom, auteur.prenom AS auteur_prenom,
    COALESCE(role_auteur.libelle, auteur.role) AS auteur_role,
    agence.nom AS cible_agence, role_cible.libelle AS cible_role
   FROM messages_diffusion m
   JOIN users auteur ON auteur.id = m.auteur_id
   LEFT JOIN roles role_auteur ON role_auteur.id = auteur.role_id
   LEFT JOIN agences agence ON agence.id = m.cible_agence_id
   LEFT JOIN roles role_cible ON role_cible.id = m.cible_role_id
   JOIN users lecteur ON lecteur.id = $1
   LEFT JOIN roles role_lecteur ON role_lecteur.id = lecteur.role_id
   WHERE (m.expire_le IS NULL OR m.expire_le > CURRENT_TIMESTAMP) AND (
     (m.cible_type = 'TOUS_SALARIES' AND lecteur.salarie = TRUE
       AND role_lecteur.code NOT IN ('CLIENT', 'MAGASIN'))
     OR (m.cible_type = 'TOUS_CLIENTS' AND role_lecteur.code = 'CLIENT')
     OR (m.cible_type = 'UTILISATEUR' AND m.cible_user_id = lecteur.id)
     OR (m.cible_type = 'ROLE' AND m.cible_role_id = lecteur.role_id)
     OR (m.cible_type = 'AGENCE' AND EXISTS (SELECT 1 FROM users_agences ua
       WHERE ua.user_id = lecteur.id AND ua.agence_id = m.cible_agence_id))
   )
   ORDER BY m.created_at DESC LIMIT 10`,
  [userId],
);

export const recupererCiblesDiffusion = async () => {
  const [agences, roles] = await Promise.all([
    sql.query(`SELECT id, nom FROM agences ORDER BY nom`),
    sql.query(`SELECT id, code, libelle FROM roles WHERE actif = TRUE AND code <> 'GM' ORDER BY ordre_affichage, libelle`),
  ]);
  return { agences, roles };
};

export const rechercherCiblesUtilisateurs = (saisie, auteurId) => sql.query(
  `SELECT u.id, u.nom, u.prenom, u.email, COALESCE(r.libelle, u.role) AS role
   FROM users u LEFT JOIN roles r ON r.id = u.role_id
   WHERE u.id <> $2 AND (r.code <> 'GM' OR EXISTS (
     SELECT 1 FROM users auteur JOIN roles ra ON ra.id = auteur.role_id WHERE auteur.id = $2 AND ra.code = 'GM'))
     AND (u.nom ILIKE $1 OR u.prenom ILIKE $1 OR u.email ILIKE $1
       OR CONCAT(u.prenom, ' ', u.nom) ILIKE $1)
   ORDER BY u.nom, u.prenom LIMIT 15`,
  [`%${saisie.trim()}%`, auteurId],
);

export const publierMessageDiffusion = async (auteurId, message) => {
  if (!(await utilisateurPeutPublier(auteurId))) return null;
  const resultat = await sql.query(
    `INSERT INTO messages_diffusion (auteur_id, titre, contenu, cible_type,
      cible_agence_id, cible_role_id, cible_user_id, expire_le)
     VALUES ($1::integer, $2::varchar, $3::text, $4::varchar,
       CASE WHEN $4::varchar = 'AGENCE' THEN $5::integer ELSE NULL END,
       CASE WHEN $4::varchar = 'ROLE' THEN $6::integer ELSE NULL END,
       CASE WHEN $4::varchar = 'UTILISATEUR' THEN $7::integer ELSE NULL END,
       CASE WHEN $8::integer IS NULL THEN NULL ELSE CURRENT_TIMESTAMP + make_interval(days => $8) END)
     RETURNING id, titre, contenu, cible_type, created_at`,
    [auteurId, message.titre, message.contenu, message.cible_type,
      message.cible_agence_id || null, message.cible_role_id || null,
      message.cible_user_id || null, message.duree_jours || null],
  );
  return resultat[0] || null;
};
