import React, { useContext, useState, useEffect } from "react";
import { PointageContext } from "../../contexte/pointageContext";

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
  const { setPointage } = useContext(PointageContext);
  const [regleHeures, setReglesHeures] = useState({
    heuresEmbauche: 8,
    minutesEmbauche: 30,
  });
  const [error, setError] = useState("");
  // const [heures, minutes, secondes = 0] = heureEmbauche.split(":");
  // const heureaRespecter = new Date();
  // heureaRespecter.setHours(regleHeures.heuresEmbauche, regleHeures.minutesEmbauche, secondes, 0);

const handleCalculPointage = (heuresValue, minutesValue) => {
  if (heuresValue === "" || minutesValue === "") {
    setError("");
    return;
  }

  const heures = Number(heuresValue);
  const minutes = Number(minutesValue);

  const heureInvalide =
    !Number.isInteger(heures) ||
    !Number.isInteger(minutes) ||
    heures < 0 ||
    heures > 23 ||
    minutes < 0 ||
    minutes > 59;

  if (heureInvalide) {
    setError("Merci de rentrer une heure valide");
    return;
  }

  setError("");

  const heureARespecter = new Date();
  heureARespecter.setHours(heures, minutes, 0, 0);

  console.log(heureARespecter);
};

useEffect(() => {
  const timeout = setTimeout(() => {
    handleCalculPointage(
      regleHeures.heuresEmbauche,
      regleHeures.minutesEmbauche,
    );
  }, 500);

  return () => clearTimeout(timeout);
}, [regleHeures.heuresEmbauche, regleHeures.minutesEmbauche]);

  return (
    <div className="flex flex-col w-full h-full justify-start gap-2 p-4">
      <p className="flex justify-center items-center card rounded-xl text-xl gap-1">
        Heure Embauche :{" "}
        <input
          type="number"
          min={1}
          max={23}
          onChange={(e) => {
            setReglesHeures((prev) => ({
              ...prev,
              heuresEmbauche: e.target.value,
            }));
          }}
          value={regleHeures.heuresEmbauche}
          className="bg-black/30 flex size-6 number-no-spinner text-right outline-none"
        />{" "}
        h{" "}
        <input
          type="number"
          min={0}
          max={59}
          onChange={(e) => {
            setReglesHeures((prev) => ({
              ...prev,
              minutesEmbauche: e.target.value,
            }));
          }}
          value={regleHeures.minutesEmbauche}
          className="bg-black/30 flex size-6 number-no-spinner text-center outline-none"
        />
        {/* {heureEmbauche} */}
      </p>
      <h1 className="flex justify-center text-red-500">{error}</h1>
      {livreurs.map((item, index) => {
        const [heure, minute, seconde] = item.pointage.split(":");

        const heurePointage = new Date();
        heurePointage.setHours(heure, minute, seconde, 0);
        // const valide =
        //   heurePointage <= heureaRespecter
        //     ? "button-primary-success"
        //     : "button-primary-echec";
        return (
          <div key={index}>
            {" "}
            
            <p className={`${"valide"} p-2 rounded-2xl`}>
              {item.role} : {item.prenom} {item.nom} {item.pointage}{" "}
            </p>
          </div>
        );
      })}
    </div>
  );
}
