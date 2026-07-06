import React from "react";

export default function CardLivReduit({
  numeroDeLivraison = 2,
  nom = "DelaTuche",
  prenom = "Didier",
  adresse = "24 Rue des Coquelicots",
  codePostal = "47300",
  ville = "Villeneuve-sur-Lot",
}) {
  return (
    <div className="flex w-full card rounded-xl justify-start">
      <div className="flex  p-2 items-center gap-2 w-full">
        <p className="flex text-blue-500 aspect-square justify-center items-center h-full rounded-md bg-(--card-bg-soft) border border-blue-500">
          {numeroDeLivraison}
        </p>
        <div className="flex flex-col w-full">
          <p className="flex flex-col gap-0.2 text-[0.6rem]">
            <span className="font-bold text-xs text-white">
              {nom} {prenom}
            </span>

            <span>{adresse}</span>
            <span>
              {codePostal} {ville}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
