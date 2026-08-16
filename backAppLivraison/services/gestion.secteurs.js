export const affilierSecteur = ({nom, agence, jour_livraison, couleur, geometrie})=>{
    const res = await.sql(`INSERT INTO secteurs (
    nom,
    agence_id,
    jour_livraison,
    couleur,
    geometrie
)
VALUES ($1, $2, $3, $4, $5::jsonb)
RETURNING *;`)
}