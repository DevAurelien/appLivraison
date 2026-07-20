import React from "react";

export default function AdminLivreurs({
  heureEmbauche = "8:30",
  livreurs = [
    { prenom: "Robert", nom: "Dutard", pointage: "8:30:20", role: "Livreur" },
    {
      prenom: "Denis",
      nom: "Sylvestre",
      pointage: "8:28:00",
      role: "Chef de Camion",
    },
  ],
}) {
  const [heures, minutes, secondes = 0] = heureEmbauche.split(":");
  const heureaRespecter = new Date();
  heureaRespecter.setHours(heures, minutes, secondes, 0);
  return (
    <div className="flex flex-col w-full h-full justify-start gap-2 p-4">
      <p className="flex justify-center card rounded-xl text-xl">
        Heure Embauche : {heureEmbauche}
      </p>
      {livreurs.map((item, index) => {
        const [heure, minute, seconde] = item.pointage.split(":");

        const heurePointage = new Date();
        heurePointage.setHours(heure, minute, seconde, 0);
        const valide =
          heurePointage <= heureaRespecter
            ? "button-primary-success"
            : "button-primary-echec";
        return (
          <p className={`${valide} p-2 rounded-2xl`} key={index}>
            {item.role} : {item.prenom} {item.nom} {item.pointage}{" "}
          </p>
        );
      })}
    </div>
  );
}
