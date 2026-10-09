import { sql } from "../database/db.js";

/**

 * @param {number} agenceId - Identifiant de l'agence
 * @returns {Promise<object>} Catalogue complet
 */
export const recupererCatalogueProduits = async (agenceId) => {
  const [
    categories,
    variantes,
    prestations,
    liensPrestations,
    options,
    liensOptions,
    temps,
    tarifs,
  ] = await Promise.all([
    // 1. Catégories de produits actives

    sql.query(`
  SELECT id, famille, nom, pieces
  FROM public.zlog_categories_produits
  WHERE actif = TRUE
  ORDER BY famille, nom
`),

    // 2. Variantes de produits actives
    sql.query(`
      SELECT id, categorie_id, nom
      FROM public.zlog_variantes_produits
      WHERE actif = TRUE
      ORDER BY nom
    `),

    // 3. Prestations actives
    sql.query(`
      SELECT id, code, nom
      FROM public.zlog_prestations
      WHERE actif = TRUE
      ORDER BY nom
    `),

    // 4. Prestations autorisées par catégorie
    sql.query(`
      SELECT
        cp.categorie_id,
        cp.prestation_id,
        cp.par_defaut
      FROM public.zlog_categories_prestations cp
      JOIN public.zlog_categories_produits c
        ON c.id = cp.categorie_id
        AND c.actif = TRUE
      JOIN public.zlog_prestations p
        ON p.id = cp.prestation_id
        AND p.actif = TRUE
    `),

    // 5. Options disponibles
    sql.query(`
      SELECT
        id,
        code,
        nom,
        type_option,
        minutes_supplementaires,
        supplement_tarifaire
      FROM public.zlog_options_produits
      WHERE actif = TRUE
      ORDER BY nom
    `),

    // 6. Options autorisées par catégorie
    sql.query(`
      SELECT
        co.categorie_id,
        co.option_id
      FROM public.zlog_categories_options co
      JOIN public.zlog_categories_produits c
        ON c.id = co.categorie_id
        AND c.actif = TRUE
      JOIN public.zlog_options_produits o
        ON o.id = co.option_id
        AND o.actif = TRUE
    `),

    // 7. Temps de référence par produit/prestation
    sql.query(`
      SELECT
        tr.categorie_id,
        tr.variante_id,
        tr.prestation_id,
        tr.minutes
      FROM public.zlog_temps_reference tr
      JOIN public.zlog_categories_produits c
        ON c.id = tr.categorie_id
        AND c.actif = TRUE
      JOIN public.zlog_prestations p
        ON p.id = tr.prestation_id
        AND p.actif = TRUE
      WHERE
        tr.variante_id IS NULL
        OR EXISTS (
          SELECT 1
          FROM public.zlog_variantes_produits v
          WHERE v.id = tr.variante_id
            AND v.categorie_id = tr.categorie_id
            AND v.actif = TRUE
        )
    `),

    // 8. Tarifs actifs de l'agence sélectionnée
    sql.query(
      `
      SELECT
        t.agence_id,
        t.categorie_id,
        t.variante_id,
        t.prestation_id,
        t.prix
      FROM public.zlog_tarifs t
      JOIN public.zlog_categories_produits c
        ON c.id = t.categorie_id
        AND c.actif = TRUE
      JOIN public.zlog_prestations p
        ON p.id = t.prestation_id
        AND p.actif = TRUE
      WHERE t.agence_id = $1
        AND t.actif = TRUE
        AND (
          t.variante_id IS NULL
          OR EXISTS (
            SELECT 1
            FROM public.zlog_variantes_produits v
            WHERE v.id = t.variante_id
              AND v.categorie_id = t.categorie_id
              AND v.actif = TRUE
          )
        )
    `,
      [agenceId],
    ),
  ]);

  return {
    categories,
    variantes,
    prestations,
    liensPrestations,
    options,
    liensOptions,
    temps,
    tarifs,
  };
};


export const recupererProduitsParPiece = async (piece) => {
  const categories = await sql.query(
    `
      SELECT
        id,
        famille,
        nom,
        pieces
      FROM public.zlog_categories_produits
      WHERE actif = TRUE
        AND (
          $1::TEXT = 'TOUTES'
          OR $1::TEXT = ANY(pieces)
        )
      ORDER BY famille, nom
    `,
    [piece],
  );

  return categories;
};
