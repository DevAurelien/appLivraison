import fs from "fs/promises";

export const recupererLivraisons = async (
  numeroDeLivraison = null,
) => {
  const contenuFichier = await fs.readFile(
    new URL("../deliveries.json", import.meta.url),
    "utf-8",
  );

  const fichierParse = JSON.parse(contenuFichier);

  const livraisons = fichierParse.livraisons;

  if (!Array.isArray(livraisons)) {
    throw new Error(
      "Le fichier deliveries.json ne contient pas un tableau de livraisons valide",
    );
  }

  if (numeroDeLivraison === null) {
    return livraisons;
  }

  const numero = Number(numeroDeLivraison);

  const livraisonTrouvee = livraisons.find(
    (livraison) =>
      livraison.numeroDeLivraison === numero,
  );

  if (!livraisonTrouvee) {
    throw new Error("Livraison non trouvée");
  }

  return livraisonTrouvee;
};