import { sql } from "../database/db.js";

export const recupererTourneesEtCamionsAgence = async (agenceId) => {
  const [tournees, camions] = await Promise.all([
    sql.query(
      `SELECT t.id, t.date_tournee, t.heure_depart_prevue, t.statut,
        t.camion_id, c.immatriculation
       FROM tournees t LEFT JOIN camions c ON c.id = t.camion_id
       WHERE t.agence_id = $1
       ORDER BY t.date_tournee, t.heure_depart_prevue, t.id`,
      [agenceId],
    ),
    sql.query(
      `SELECT id, immatriculation, marque, modele, statut
       FROM camions WHERE agence_id = $1 ORDER BY immatriculation`,
      [agenceId],
    ),
  ]);
  return { tournees, camions };
};

export const affecterCamionTournee = async (agenceId, tourneeId, camionId) => {
  const resultat = await sql.query(
    `UPDATE tournees t SET camion_id = $3, updated_at = NOW()
     WHERE t.id = $2 AND t.agence_id = $1
       AND t.statut NOT IN ('TERMINEE', 'ANNULEE')
       AND EXISTS (SELECT 1 FROM camions c WHERE c.id = $3 AND c.agence_id = $1)
     RETURNING t.*`,
    [agenceId, tourneeId, camionId],
  );
  return resultat[0] || null;
};
