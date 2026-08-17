import { sql } from "../database/db.js";

export const recupSalaries = async (saisie, userId) => {
  const recup = await sql.query(
    `
      SELECT nom, prenom, id, avatar_img_url
      FROM users
      WHERE (prenom ILIKE $1 OR nom ILIKE $1)
        AND salarie = TRUE
        AND id != $2
    `,
    [`${saisie}%`, userId],
  );

  return recup;
};

export const recupImgSalaries = async (id) => {
  const resultat = await sql.query(
    `
      SELECT avatar_img_url
      FROM users
      WHERE id = $1
        AND salarie = TRUE
    `,
    [id],
  );

  return resultat[0]?.avatar_img_url ?? null;
};

export const rechercherLivreurs = async (saisie = "") => {
  const terme = `%${saisie.trim()}%`;
  return sql.query(
    `SELECT u.id, u.nom, u.prenom, u.email, u.avatar_img_url,
      r.code AS role_code, COALESCE(r.libelle, u.role) AS role,
      a.id AS agence_id, a.nom AS agence_nom
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    LEFT JOIN users_agences ua ON ua.user_id = u.id AND ua.est_principale = TRUE
    LEFT JOIN agences a ON a.id = ua.agence_id
    WHERE u.salarie = TRUE
      AND ($1 = '%%' OR u.email ILIKE $1 OR u.nom ILIKE $1
        OR u.prenom ILIKE $1 OR CONCAT(u.prenom, ' ', u.nom) ILIKE $1)
    ORDER BY u.nom, u.prenom
    LIMIT 30;`,
    [terme],
  );
};

export const affilierLivreurAgence = async (userId, agenceId) => {
  const res = await sql.query(
    `WITH retrait_principale AS (
      UPDATE users_agences SET est_principale = FALSE
      WHERE user_id = $1
    )
    INSERT INTO users_agences (user_id, agence_id, est_principale)
    SELECT u.id, $2, TRUE FROM users u
    WHERE u.id = $1 AND u.salarie = TRUE
    ON CONFLICT (user_id, agence_id)
    DO UPDATE SET est_principale = TRUE
    RETURNING *;`,
    [userId, agenceId],
  );
  return res[0] || null;
};

export const recupererOrganisationAgence = async (agenceId = null) => {
  const livreurs = await sql.query(
    `SELECT u.id, u.nom, u.prenom, u.email,
      COALESCE(r.libelle, u.role, 'Salarié') AS role,
      a.id AS agence_id, a.nom AS agence_nom,
      ce.camion_id, c.immatriculation, a.heure_embauche,
      a.duree_travail_journaliere_minutes, a.pause_prevue_minutes,
      p.arrival_pointed_at, p.start_pause_pointed_at,
      p.end_pause_pointed_at, p.departure_pointed_at,
      p.presence_minutes, p.pause_minutes, p.temps_travaille_minutes,
      TO_CHAR(a.heure_embauche
        + make_interval(mins => a.duree_travail_journaliere_minutes + a.pause_prevue_minutes),
        'HH24:MI') AS fin_theorique,
      CASE WHEN p.pause_minutes IS NULL THEN NULL ELSE
        GREATEST(0, p.pause_minutes - a.pause_prevue_minutes) END AS depassement_pause_minutes,
      CASE WHEN p.departure_pointed_at IS NULL THEN NULL ELSE
        FLOOR(EXTRACT(EPOCH FROM (
          (p.departure_pointed_at AT TIME ZONE 'Europe/Paris')
          - (p.date_jour + a.heure_embauche
            + make_interval(mins => a.duree_travail_journaliere_minutes + a.pause_prevue_minutes))
        )) / 60)::integer END AS ecart_depart_minutes,
      CASE WHEN p.temps_travaille_minutes IS NULL THEN NULL ELSE
        p.temps_travaille_minutes - a.duree_travail_journaliere_minutes END
        AS ecart_temps_travaille_minutes,
      CASE WHEN p.arrival_pointed_at IS NULL THEN NULL ELSE
        GREATEST(0, FLOOR(EXTRACT(EPOCH FROM (
          (p.arrival_pointed_at AT TIME ZONE 'Europe/Paris')
          - (p.date_jour + a.heure_embauche)
        )) / 60))::integer END AS retard_minutes
    FROM users u
    LEFT JOIN users_agences ua ON ua.user_id = u.id AND ua.est_principale = TRUE
    LEFT JOIN roles r ON r.id = u.role_id
    LEFT JOIN agences a ON a.id = ua.agence_id
    LEFT JOIN camions_equipages ce ON ce.user_id = u.id
    LEFT JOIN camions c ON c.id = ce.camion_id
    LEFT JOIN pointages p ON p.user_id = u.id AND p.date_jour = CURRENT_DATE
    WHERE u.salarie = TRUE AND ($1::integer IS NULL OR ua.agence_id = $1)
    ORDER BY u.nom, u.prenom;`,
    [agenceId],
  );
  const camions = await sql.query(
    `SELECT c.id, c.immatriculation, c.marque, c.modele, c.statut,
      COALESCE(json_agg(json_build_object(
        'id', u.id, 'nom', u.nom, 'prenom', u.prenom, 'position', ce.position
      ) ORDER BY ce.position) FILTER (WHERE u.id IS NOT NULL), '[]') AS equipage
    FROM camions c
    LEFT JOIN camions_equipages ce ON ce.camion_id = c.id
    LEFT JOIN users u ON u.id = ce.user_id
    WHERE c.agence_id = $1
    GROUP BY c.id
    ORDER BY c.immatriculation;`,
    [agenceId],
  );
  return { livreurs, camions };
};

export const verifierLivreursPourCamion = async (camionId, userIds) => {
  return sql.query(
    `SELECT u.id
    FROM camions c
    JOIN users_agences ua ON ua.agence_id = c.agence_id AND ua.est_principale = TRUE
    JOIN users u ON u.id = ua.user_id
    JOIN roles r ON r.id = u.role_id
    WHERE c.id = $1 AND u.id = ANY($2::int[])
      AND r.code IN ('LIVREUR', 'CHEF_CAMION');`,
    [camionId, userIds],
  );
};

export const recupererAgenceCamion = async (camionId) => {
  const res = await sql.query(`SELECT agence_id FROM camions WHERE id = $1`, [camionId]);
  return res[0]?.agence_id ?? null;
};

export const affecterEquipageCamion = async (camionId, userIds, affectePar) => {
  const res = await sql.query(
    `WITH suppression AS (
      DELETE FROM camions_equipages
      WHERE camion_id = $1 OR user_id = ANY($2::int[])
    )
    INSERT INTO camions_equipages (camion_id, user_id, position, affecte_par)
    SELECT $1, user_id, position, $3
    FROM unnest($2::int[]) WITH ORDINALITY AS equipe(user_id, position)
    RETURNING *;`,
    [camionId, userIds, affectePar],
  );
  return res;
};
