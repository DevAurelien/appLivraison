import { sql } from "../database/db.js";

export const rechercherSalariesMessagerie = (saisie, userId) => {
  const terme = `%${saisie.trim()}%`;
  return sql.query(
    `SELECT u.id, u.nom, u.prenom, u.email, u.avatar_img_url, u.salarie,
      r.code AS role_code, COALESCE(r.libelle, u.role, 'Utilisateur') AS role
    FROM users u LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.id <> $2
      AND (EXISTS (SELECT 1 FROM users moi JOIN roles rm ON rm.id = moi.role_id
          WHERE moi.id = $2 AND rm.code = 'GM')
        OR (u.salarie = TRUE AND COALESCE(r.code, '') NOT IN ('CLIENT', 'MAGASIN', 'GM')))
      AND (COALESCE(r.code, '') <> 'GM' OR EXISTS (
        SELECT 1 FROM users moi JOIN roles rm ON rm.id = moi.role_id WHERE moi.id = $2 AND rm.code = 'GM'))
      AND (u.nom ILIKE $1 OR u.prenom ILIKE $1 OR u.email ILIKE $1
        OR CONCAT(u.prenom, ' ', u.nom) ILIKE $1)
      AND EXISTS (SELECT 1 FROM users moi JOIN roles rm ON rm.id = moi.role_id
        WHERE moi.id = $2 AND (rm.code = 'GM' OR
          (moi.salarie = TRUE AND rm.code NOT IN ('CLIENT', 'MAGASIN'))))
    ORDER BY u.nom, u.prenom LIMIT 20`,
    [terme, userId],
  );
};

export const creerOuTrouverConversation = async (userId, contactId) => {
  const [user1, user2] = [userId, contactId].sort((a, b) => a - b);
  const resultat = await sql.query(
    `INSERT INTO conversations_privees (user_1_id, user_2_id)
     SELECT $1, $2
     WHERE EXISTS (SELECT 1 FROM users moi JOIN roles rm ON rm.id = moi.role_id
       WHERE moi.id = $4 AND rm.code = 'GM')
       OR (SELECT COUNT(*) FROM users u JOIN roles r ON r.id = u.role_id
         WHERE u.id = ANY($3::int[]) AND u.salarie = TRUE
           AND r.code NOT IN ('CLIENT', 'MAGASIN', 'GM')) = 2
     ON CONFLICT (user_1_id, user_2_id) DO UPDATE SET updated_at = conversations_privees.updated_at
     RETURNING id`,
    [user1, user2, [userId, contactId], userId],
  );
  return resultat[0] || null;
};

export const listerConversations = (userId) => sql.query(
  `SELECT c.id, 'PRIVEE'::text AS type, contact.id AS contact_id, contact.nom, contact.prenom,
    contact.email, contact.avatar_img_url,
    COALESCE(r.libelle, contact.role, 'Salarié') AS role,
    dernier.contenu AS dernier_message, dernier.created_at AS dernier_message_le,
    COUNT(non_lu.id)::integer AS non_lus
   FROM conversations_privees c
   JOIN users contact ON contact.id = CASE WHEN c.user_1_id = $1 THEN c.user_2_id ELSE c.user_1_id END
   LEFT JOIN roles r ON r.id = contact.role_id
   LEFT JOIN LATERAL (
     SELECT contenu, created_at FROM messages_prives
     WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1
   ) dernier ON TRUE
   LEFT JOIN messages_prives non_lu ON non_lu.conversation_id = c.id
     AND non_lu.sender_id <> $1 AND non_lu.lu_at IS NULL
   WHERE $1 IN (c.user_1_id, c.user_2_id)
   GROUP BY c.id, contact.id, r.libelle, dernier.contenu, dernier.created_at
   ORDER BY COALESCE(dernier.created_at, c.created_at) DESC`,
  [userId],
);

const synchroniserCanauxAccessibles = async (userId) => {
  await sql.query(
    `INSERT INTO canaux_discussion (type, agence_id)
     SELECT 'AGENCE', ua.agence_id FROM users_agences ua
     JOIN users u ON u.id = ua.user_id JOIN roles r ON r.id = u.role_id
     WHERE u.id = $1 AND ua.est_principale = TRUE
       AND u.salarie = TRUE AND r.code IN ('LIVREUR', 'CHEF_CAMION', 'CHEF_AGENCE')
     ON CONFLICT (agence_id) WHERE type = 'AGENCE' DO NOTHING`,
    [userId],
  );
  await sql.query(
    `INSERT INTO canaux_discussion (type, agence_id, livraison_id)
     SELECT 'LIVRAISON', l.agence_id, l.id FROM livraisons l
     WHERE l.client_id = $1 OR EXISTS (
       SELECT 1 FROM users_agences ua JOIN users u ON u.id = ua.user_id
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1 AND ua.agence_id = l.agence_id AND ua.est_principale = TRUE
         AND u.salarie = TRUE AND r.code IN ('LIVREUR', 'CHEF_CAMION', 'CHEF_AGENCE')
     )
     ON CONFLICT (livraison_id) WHERE type = 'LIVRAISON' DO NOTHING`,
    [userId],
  );
};

export const listerCanaux = async (userId) => {
  await synchroniserCanauxAccessibles(userId);
  return sql.query(
    `SELECT c.id, c.type,
      CASE WHEN c.type = 'AGENCE' THEN CONCAT('Équipe · ', a.nom)
        ELSE CONCAT('Livraison · ', COALESCE(l.reference_commande, '#' || l.id::text)) END AS nom,
      CASE WHEN c.type = 'AGENCE' THEN 'Canal interne de l’agence'
        ELSE CONCAT(COALESCE(a.nom, 'Agence'), ' · ', COALESCE(l.ville, 'livraison')) END AS role,
      dernier.contenu AS dernier_message, dernier.created_at AS dernier_message_le,
      c.agence_id, c.livraison_id
     FROM canaux_discussion c
     LEFT JOIN agences a ON a.id = c.agence_id
     LEFT JOIN livraisons l ON l.id = c.livraison_id
     LEFT JOIN LATERAL (SELECT contenu, created_at FROM messages_canaux
       WHERE canal_id = c.id ORDER BY created_at DESC LIMIT 1) dernier ON TRUE
     WHERE (c.type = 'LIVRAISON' AND l.client_id = $1)
       OR EXISTS (
         SELECT 1 FROM users_agences ua JOIN users u ON u.id = ua.user_id
         JOIN roles r ON r.id = u.role_id
         WHERE u.id = $1 AND ua.agence_id = c.agence_id AND ua.est_principale = TRUE
           AND u.salarie = TRUE AND r.code IN ('LIVREUR', 'CHEF_CAMION', 'CHEF_AGENCE')
       )
     ORDER BY COALESCE(dernier.created_at, c.created_at) DESC`,
    [userId],
  );
};

const accesCanal = `EXISTS (
  SELECT 1 FROM canaux_discussion c
  LEFT JOIN livraisons l ON l.id = c.livraison_id
  WHERE c.id = $1 AND ((c.type = 'LIVRAISON' AND l.client_id = $2) OR EXISTS (
    SELECT 1 FROM users_agences ua JOIN users u ON u.id = ua.user_id
    JOIN roles r ON r.id = u.role_id
    WHERE u.id = $2 AND ua.agence_id = c.agence_id AND ua.est_principale = TRUE
      AND u.salarie = TRUE AND r.code IN ('LIVREUR', 'CHEF_CAMION', 'CHEF_AGENCE')
  )))`;

export const listerMessagesCanal = async (canalId, userId) => {
  const autorise = await sql.query(`SELECT ${accesCanal} AS autorise`, [canalId, userId]);
  if (!autorise[0]?.autorise) return null;
  return sql.query(
    `SELECT m.id, m.sender_id, m.contenu, m.created_at,
      u.nom AS sender_nom, u.prenom AS sender_prenom
     FROM messages_canaux m JOIN users u ON u.id = m.sender_id
     WHERE m.canal_id = $1 ORDER BY m.created_at ASC LIMIT 300`,
    [canalId],
  );
};

export const envoyerMessageCanal = async (canalId, userId, contenu) => {
  const resultat = await sql.query(
    `INSERT INTO messages_canaux (canal_id, sender_id, contenu)
     SELECT $1, $2, $3 WHERE ${accesCanal}
     RETURNING id, sender_id, contenu, created_at`,
    [canalId, userId, contenu],
  );
  return resultat[0] || null;
};

export const recupererAvatarMessagerie = async (viewerId, cibleId) => {
  const resultat = await sql.query(
    `SELECT cible.avatar_img_url FROM users cible
     LEFT JOIN roles rc ON rc.id = cible.role_id
     WHERE cible.id = $2 AND cible.avatar_img_url IS NOT NULL
       AND (EXISTS (SELECT 1 FROM users moi JOIN roles rm ON rm.id = moi.role_id
         WHERE moi.id = $1 AND rm.code = 'GM')
       OR (COALESCE(rc.code, '') <> 'GM' AND (
         EXISTS (SELECT 1 FROM users moi WHERE moi.id = $1 AND moi.salarie = TRUE AND cible.salarie = TRUE)
         OR EXISTS (SELECT 1 FROM livraisons l JOIN users_agences ua ON ua.agence_id = l.agence_id
           WHERE l.client_id = $1 AND ua.user_id = $2 AND ua.est_principale = TRUE)
         OR EXISTS (SELECT 1 FROM livraisons l JOIN users_agences ua ON ua.agence_id = l.agence_id
           WHERE l.client_id = $2 AND ua.user_id = $1 AND ua.est_principale = TRUE)
       )))`,
    [viewerId, cibleId],
  );
  return resultat[0]?.avatar_img_url || null;
};

export const listerMessages = async (conversationId, userId) => {
  const autorisation = await sql.query(
    `SELECT id FROM conversations_privees WHERE id = $1 AND $2 IN (user_1_id, user_2_id)`,
    [conversationId, userId],
  );
  if (!autorisation[0]) return null;
  await sql.query(
    `UPDATE messages_prives SET lu_at = CURRENT_TIMESTAMP
     WHERE conversation_id = $1 AND sender_id <> $2 AND lu_at IS NULL`,
    [conversationId, userId],
  );
  return sql.query(
    `SELECT id, sender_id, contenu, created_at, lu_at FROM messages_prives
     WHERE conversation_id = $1 ORDER BY created_at ASC LIMIT 300`,
    [conversationId],
  );
};

export const envoyerMessagePrive = async (conversationId, userId, contenu) => {
  const resultat = await sql.query(
    `WITH autorisee AS (
       SELECT id FROM conversations_privees
       WHERE id = $1 AND $2 IN (user_1_id, user_2_id)
     ), nouveau AS (
       INSERT INTO messages_prives (conversation_id, sender_id, contenu)
       SELECT id, $2, $3 FROM autorisee RETURNING *
     ), maj AS (
       UPDATE conversations_privees SET updated_at = CURRENT_TIMESTAMP
       WHERE id IN (SELECT conversation_id FROM nouveau)
     )
     SELECT id, sender_id, contenu, created_at, lu_at FROM nouveau`,
    [conversationId, userId, contenu],
  );
  return resultat[0] || null;
};
