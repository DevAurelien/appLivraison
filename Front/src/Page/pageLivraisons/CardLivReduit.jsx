import React from "react";

export default function CardLivReduit({
  onClick=()=>{},
  numeroDeLivraison = 1,
  client = {
    nom: "Dutard",
    prenom: "Jean-Pierre",
    telephone: "06 12 45 78 90",
  },
  adresse = {
    rue: "16 Rue des Lilas",
    codePostal: "47300",
    ville: "Villeneuve-sur-Lot",
  },
  magasin = {
    nom: "BUT VILLENEUVE",
  },
  estimation = {
    heure: "10:45",
    creneau: "10:00 - 13:00",
    dureeProchaineLivraison: "7 min",
    distanceProchaineLivraison: "4.8 km",
  },
  produits = [
    { nom: "Réfrigérateur", categorie: "Installation", reprise: true },
    { nom: "Table basse", categorie: "Depose", reprise: false },
  ],
}) {
  return (
    <div onClick={onClick} className="flex shrink-0 w-full card rounded-xl justify-start cursor-pointer">
      <div className="flex  p-2 items-center gap-2 w-full">
        <p className="flex text-blue-500 aspect-square justify-center items-center h-full rounded-md bg-(--card-bg-soft) border border-blue-500">
          {numeroDeLivraison}
        </p>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-0.2 text-[0.6rem]">
            <p className="font-bold text-xs text-white">
              {client.nom} {client.prenom}
            </p>

            <p>{adresse.rue}</p>
            <p>
              {adresse.codePostal} {adresse.ville}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
