import { sql } from "../database/db.js";

const accesOperationnel = `(
  EXISTS (SELECT 1 FROM users moi JOIN roles rm ON rm.id = moi.role_id WHERE moi.id = $2 AND rm.code = 'GM')
  OR EXISTS (SELECT 1 FROM users_agences ua JOIN users moi ON moi.id = ua.user_id
    JOIN roles rm ON rm.id = moi.role_id WHERE moi.id = $2 AND ua.agence_id = l.agence_id
      AND ua.est_principale = TRUE AND moi.salarie = TRUE
      AND rm.code IN ('LIVREUR', 'CHEF_CAMION', 'CHEF_AGENCE'))
)`;

export const recupererLivraisons = async (userId) => {
  const lignes = await sql.query(
    `SELECT l.id, l.reference_commande, l.adresse, l.complement_adresse,
      l.code_postal, l.ville, l.statut, l.creneau_debut, l.creneau_fin,
      COALESCE(l.destinataire_nom, client.nom) AS client_nom,
      COALESCE(l.destinataire_prenom, client.prenom) AS client_prenom,
      COALESCE(l.destinataire_telephone, client.phone) AS client_telephone,
      COALESCE(l.donneur_ordre_nom, createur.nom, 'Magasin') AS magasin_nom,
      te.ordre, te.heure_arrivee_estimee,
      COALESCE(json_agg(json_build_object(
        'id', o.id, 'nom', o.designation, 'categorie',
          CASE WHEN UPPER(COALESCE(o.mode_livraison, '')) LIKE '%INSTALL%' THEN 'Installation'
               WHEN UPPER(COALESCE(o.mode_livraison, '')) LIKE '%PIED%' THEN 'PiedCamion' ELSE 'Depose' END,
        'reprise', UPPER(COALESCE(o.type_operation, '')) LIKE '%REPRISE%' OR UPPER(COALESCE(o.commentaire, '')) = 'REPRISE',
        'statut', CASE o.statut_operation WHEN 'REALISEE' THEN 'LIVRE'
          WHEN 'IMPOSSIBLE' THEN 'DEFECTUEUX' WHEN 'REFUSEE' THEN 'NON_CONFORME'
          ELSE 'A_LIVRER' END
      ) ORDER BY o.id) FILTER (WHERE o.id IS NOT NULL), '[]') AS produits
     FROM livraisons l
     LEFT JOIN users client ON client.id = l.client_id
     LEFT JOIN users createur ON createur.id = l.cree_par
     LEFT JOIN tournee_etapes te ON te.livraison_id = l.id
     LEFT JOIN tournees t ON t.id = te.tournee_id
     LEFT JOIN operations_livraison o ON o.livraison_id = l.id
     WHERE l.client_id = $1 OR ${accesOperationnel}
     GROUP BY l.id, client.id, createur.id, te.ordre, te.heure_arrivee_estimee, t.date_tournee
     ORDER BY COALESCE(t.date_tournee, l.date_livraison_prevue), COALESCE(te.ordre, l.id)`,
    [userId, userId],
  );
  return lignes.map((ligne, index) => ({
    id: ligne.id,
    numeroDeLivraison: ligne.ordre || index + 1,
    statut: ligne.statut,
    client: { nom: ligne.client_nom, prenom: ligne.client_prenom, telephone: ligne.client_telephone },
    adresse: { rue: [ligne.adresse, ligne.complement_adresse].filter(Boolean).join(" "), codePostal: ligne.code_postal, ville: ligne.ville },
    magasin: { nom: ligne.magasin_nom },
    estimation: {
      heure: ligne.heure_arrivee_estimee ? new Date(ligne.heure_arrivee_estimee).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }) : null,
      creneau: ligne.creneau_debut && ligne.creneau_fin ? `${String(ligne.creneau_debut).slice(0, 5)} - ${String(ligne.creneau_fin).slice(0, 5)}` : null,
    },
    produits: ligne.produits,
  }));
};

export const modifierStatutArticle = async (livraisonId, operationId, userId, statut) => {
  const statutsBdd = { A_LIVRER: "A_TRAITER", LIVRE: "REALISEE", DEFECTUEUX: "IMPOSSIBLE", NON_CONFORME: "REFUSEE" };
  const resultat = await sql.query(
    `UPDATE operations_livraison o SET statut_operation = $4, updated_at = CURRENT_TIMESTAMP
     FROM livraisons l WHERE o.id = $3 AND o.livraison_id = l.id AND l.id = $1
       AND ${accesOperationnel} RETURNING o.id, CASE o.statut_operation
         WHEN 'REALISEE' THEN 'LIVRE' WHEN 'IMPOSSIBLE' THEN 'DEFECTUEUX'
         WHEN 'REFUSEE' THEN 'NON_CONFORME' ELSE 'A_LIVRER' END AS statut`,
    [livraisonId, userId, operationId, statutsBdd[statut]],
  );
  return resultat[0] || null;
};

export const finaliserLivraison = async (livraisonId, userId, donnees) => {
  const statutLivraison = donnees.resultat === "LIVREE" ? "LIVREE" : "ECHEC";
  const resultat = await sql.query(
    `WITH autorisee AS (SELECT l.id FROM livraisons l WHERE l.id = $1 AND ${accesOperationnel}),
     execution AS (
       INSERT INTO executions_livraisons (livraison_id, resultat, motif_echec, commentaire,
         non_conforme, decharge_conformite, decharge_risque, decharge_signataire,
         decharge_accepte_risques, decharge_conserve_produit, decharge_signee_le, effectue_par)
       SELECT id, $3, $4, $5, $6, $7, $8, $9, $10, $11,
         CASE WHEN $7 THEN CURRENT_TIMESTAMP ELSE NULL END, $2 FROM autorisee
       ON CONFLICT (livraison_id) DO UPDATE SET resultat = EXCLUDED.resultat,
         motif_echec = EXCLUDED.motif_echec, commentaire = EXCLUDED.commentaire,
         non_conforme = EXCLUDED.non_conforme, decharge_conformite = EXCLUDED.decharge_conformite,
         decharge_risque = EXCLUDED.decharge_risque, decharge_signataire = EXCLUDED.decharge_signataire,
         decharge_accepte_risques = EXCLUDED.decharge_accepte_risques,
         decharge_conserve_produit = EXCLUDED.decharge_conserve_produit,
         decharge_signee_le = EXCLUDED.decharge_signee_le,
         effectue_par = EXCLUDED.effectue_par, effectue_le = CURRENT_TIMESTAMP RETURNING livraison_id
     ) UPDATE livraisons SET statut = $12, updated_at = CURRENT_TIMESTAMP
       WHERE id IN (SELECT livraison_id FROM execution) RETURNING id, statut`,
    [livraisonId, userId, donnees.resultat, donnees.motif_echec || null, donnees.commentaire || null,
      Boolean(donnees.non_conforme), Boolean(donnees.decharge_intervention), donnees.decharge_risque || null,
      donnees.decharge_signataire || null, Boolean(donnees.decharge_accepte_risques),
      Boolean(donnees.decharge_conserve_produit), statutLivraison],
  );
  return resultat[0] || null;
};

export const declarerIncidentLivraison = async (livraisonId, userId, type, description) => {
  const resultat = await sql.query(
    `INSERT INTO incidents_livraisons (livraison_id, type, description, declare_par)
     SELECT l.id, $3, $4, $2 FROM livraisons l WHERE l.id = $1 AND ${accesOperationnel}
     RETURNING id, type, statut, created_at`,
    [livraisonId, userId, type, description],
  );
  return resultat[0] || null;
};

export const ajouterPhotoLivraison = async (livraisonId, userId, blobUrl) => {
  const resultat = await sql.query(
    `INSERT INTO photos_livraisons (livraison_id, blob_url, ajoutee_par)
     SELECT l.id, $3, $2 FROM livraisons l WHERE l.id = $1 AND ${accesOperationnel}
     RETURNING id, created_at`,
    [livraisonId, userId, blobUrl],
  );
  return resultat[0] || null;
};

export const verifierAccesLivraison = async (livraisonId, userId) => {
  const resultat = await sql.query(`SELECT l.id FROM livraisons l WHERE l.id = $1 AND ${accesOperationnel}`, [livraisonId, userId]);
  return Boolean(resultat[0]);
};
