import fs from "fs/promises";

export const recupererLivraisons = async (id = null) => {
  let fichierParse = JSON.parse(
await fs.readFile(new URL("../deliveries.json", import.meta.url), "utf-8")  );
  if (!(id === null)) {
    id = Number(id);
    let livraisonTrouver = fichierParse.find((el) => el.id === id);
    if (livraisonTrouver) return livraisonTrouver;
    else throw new Error("Livraison non trouvé");
  } else {
    return fichierParse;
  }
};
