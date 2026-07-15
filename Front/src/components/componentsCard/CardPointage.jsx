import { useState, useEffect } from "react";
import Radar from "../componentsIcone/Radar.jsx";

export default function CardPointage() {
  const [action, setAction] = useState("non");
  const [moment, setMoment] = useState("du matin");
  const [isPointé, setIsPointé] = useState(false);
  const dateActuelle = new Date();
  const date = dateActuelle.toLocaleDateString("fr-FR");
  const heure = dateActuelle.toLocaleTimeString("fr-FR");
  const accessToken = localStorage.getItem("accessToken");
  const [mesPointages, setMesPointages] = useState([]);

  useEffect(() => {
    const verifierMoment = () => {
      const heureActuelle = new Date().getHours();

      if (heureActuelle < 12) {
        setMoment("du matin");
      } else {
        setMoment("de l'après-midi");
      }
    };

    verifierMoment();

    const interval = setInterval(verifierMoment, 60 * 1000);
    // verification chaques minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const synchroniserPointages = async () => {
      const pointages =
        JSON.parse(localStorage.getItem("pointagesPending")) || [];

      if (pointages.length === 0) return;

      for (const pointage of pointages) {
        try {
          const res = await apifetch(`/pointages`, "POST", {
            body: JSON.stringify(pointage),
          });

          if (res.ok) {
            const pointagesActuels =
              JSON.parse(localStorage.getItem("pointagesPending")) || [];

            const restants = pointagesActuels.filter(
              (p) => p.idLocal !== pointage.idLocal,
            );

            localStorage.setItem("pointagesPending", JSON.stringify(restants));
          }
        } catch (error) {
          console.log("Synchro impossible pour l'instant");
        }
      }
    };

    window.addEventListener("online", synchroniserPointages);

    synchroniserPointages();

    return () => {
      window.removeEventListener("online", synchroniserPointages);
    };
  }, []);

  const handlePointage = () => {
    setAction("");
    setIsPointé(true);
  };

  return (
    <div className="w-full flex p-2 text-[0.8rem] card rounded-xl opacity-[0.8] justify-between">
      <div className="flex w-full gap-4 -start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 p-1">
          <Radar color1="green" className="h-5 w-5" />
        </div>

        <div className="flex flex-col">
          <h1 className="select-none">Pointer ma présence</h1>

          <p className="select-none text-[0.6rem]">
            Pointage {moment} {action} effectué{" "}
            {action === "" ? `a ${heure}` : ""}
          </p>
        </div>
      </div>
      <button
        disabled={isPointé}
        onClick={handlePointage}
        className="text-black bg-yellow-300 rounded-md self-center px-4 p-1 cursor-pointer"
      >
        Pointer
      </button>
    </div>
  );
}
