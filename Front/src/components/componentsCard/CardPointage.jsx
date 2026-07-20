import { useState, useEffect, useContext } from "react";
import Radar from "../componentsIcone/Radar.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";

export default function CardPointage() {
  const [fichePointage, setFichePointage] = useState({
    action: "non",
    moment: "du matin",
    isPointé: false,
    heurePointage: "",
    resPointageOk: false,
  });
  const { user, setUser } = useContext(UserContext);
  const [mesPointages, setMesPointages] = useState([]);

  useEffect(() => {
    const verifierMoment = () => {
      const heureActuelle = new Date().getHours();

      if (heureActuelle < 12) {
        setFichePointage((prev) => ({ ...prev, moment: "du matin" }));
      } else {
        setFichePointage((prev) => ({ ...prev, moment: "de l'après-midi" }));
      }
    };

    verifierMoment();

    const interval = setInterval(verifierMoment, 60 * 1000);
    // verification chaques minutes

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {

  //       try {
  //         const res = await apifetch(`/pointages`, "POST", {
  //           body: JSON.stringify(pointage),
  //         });

  //         if (res.ok) {

  //         }
  //       } catch (error) {
  //         console.log("Pointage impossible pour l'instant");
  //       }

  //     }, []);

  const handlePointage = async () => {
    const dateActuelle = new Date();
    const date = dateActuelle.toLocaleDateString("fr-FR");
    const heure = dateActuelle.toLocaleTimeString("fr-FR");
    const res = await apiFetch(`/pointages/${user.id}`, "POST", {
      body: JSON.stringify({ datePointage: date, heurePointage: heure }),
    });
    if (!res.ok) return;
    const reponse = await res.json();
    setFichePointage((prev) => ({
      ...prev,
      action: "",
      isPointé: true,
      heurePointage: heure,
      resPointageOk: reponse,
    }));
    setUser((prev) => ({ ...prev, heurePointage: heure }));
  };

  return (
    <div className="w-full flex p-2 text-[0.8rem] card rounded-xl opacity-[0.8] justify-between">
      <div className="flex w-full gap-4 ">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 p-1">
          <Radar color1="green" className="size-5" />
        </div>
        
        <div className="flex flex-col">
          <h1 className="select-none">Pointer ma présence</h1>

          {fichePointage.resPointageOk ? (
            <p className="select-none text-[0.6rem]">
              Pointage {fichePointage.moment} non effectué{" "}
            </p>
          ) : (
            <p className="select-none text-[0.6rem]">
              Pointage {fichePointage.moment} {fichePointage.action} effectué{" "}
              {fichePointage.action === ""
                ? `a ${fichePointage.heurePointage}`
                : ""}
              
            </p>
          )}
        </div>
      </div>
      <button
        disabled={fichePointage.isPointé}
        onClick={handlePointage}
        className="text-black bg-(--yellow-zesteo) rounded-md self-center px-4 p-1 cursor-pointer"
      >
        Pointer
      </button>
    </div>
  );
}
