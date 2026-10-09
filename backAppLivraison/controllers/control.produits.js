import { recupererCatalogueProduits } from '../services/gestion.produits.js';

/** GET /catalogue?agenceId=123 */
export async function obtenirCatalogueProduits(req, res) {
  const agenceId = String(req.query.agenceId ?? '');

  if (!/^[1-9]\d*$/.test(agenceId)) {
    return res.status(400).json({ error: 'agenceId doit être un entier positif.' });
  }

  try {
    const catalogue = await recupererCatalogueProduits(agenceId);
    return res.status(200).json(catalogue);
  } catch (error) {
    console.error('Erreur lors de la récupération du catalogue produits :', error);
    return res.status(500).json({ error: 'Impossible de charger le catalogue produits.' });
  }
}
