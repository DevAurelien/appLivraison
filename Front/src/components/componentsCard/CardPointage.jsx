import { useState, useEffect, useContext } from "react";
import Radar from "../componentsIcone/Radar.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import Pulse from "../Loading.jsx";

export default function CardPointage() {
  const [fichePointage, setFichePointage] = useState({
    action: "non",
    moment: "du matin",
    isPointé: false,
    heurePointage: "",
    resPointageOk: false,
  });

  const [pointer, setPointer] = useState({
    loading: false,
    aPointé: false,
    date_jour: null,
    date_bdd: null,
    arrival_pointed_at: null,
    start_pause_pointed_at: null,
    end_pause_pointed_at: null,
    departure_pointed_at: null,
    created_at: null,
    erreur: null,
  });
  const [moment, setMoment] = useState("du matin");
  const { user, setUser } = useContext(UserContext);
  const [mesPointages, setMesPointages] = useState([]);

  useEffect(() => {
    // moment de la journée

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

  //   useEffect(() => {
  //   if (user?.heurePointage) {
  //     setFichePointage((prev) => ({
  //       ...prev,
  //       isPointé: true,
  //       heurePointage: user.heurePointage,
  //       resPointageOk: true,
  //       action: "",
  //     }));
  //   } else {
  //     setFichePointage((prev) => ({
  //       ...prev,
  //       isPointé: false,
  //       resPointageOk: false,
  //       action: "non",
  //     }));
  //   }
  // }, [user?.heurePointage]);

  const handlePointage = async () => {
    if (user?.heurePointage) return;
    const dateActuelle = new Date();
    const date = dateActuelle.toLocaleDateString("fr-FR");
    const heure = dateActuelle.toLocaleTimeString("fr-FR");
    const res = await apiFetch(`/pointages/assigner/${user.id}`, "POST", {
      body: JSON.stringify({ datePointage: date, heurePointage: heure }),
    });
    if (!res.ok) return;
    const reponse = await res.json();
    setFichePointage((prev) => ({
      ...prev,
      action: "",
      isPointé: true,
      heurePointage: heure,
      resPointageOk: reponse === true,
    }));
    setUser((prev) => ({ ...prev, heurePointage: heure }));
  };
  // const date = dateActuelle.toLocaleDateString("fr-FR");
  //   const heure = dateActuelle.toLocaleTimeString("fr-FR");

  const handlePointer = async () => {
    //  if (user?.heurePointage) return;
    setPointer((prev) => ({ ...prev, loading: true }));
    const dateActuelle = new Date();

    apiFetch(`/pointed/assign/`, "POST")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setPointer((prev) => ({
          ...prev,
          loading: false,
          id: data?.id,
          user_id: data?.user_id,
          date_jour: dateActuelle,
          date_bdd: data?.date_jour,
          arrival_pointed_at: data?.arrival_pointed_at || null,
          start_pause_pointed_at: data?.start_pause_pointed_at || null,
          end_pause_pointed_at: data?.end_pause_pointed_at || null,
          departure_pointed_at: data?.departure_pointed_at || null,
          created_at: data?.created_at || null,
          erreur: data?.erreur || null,
        }));
      });
  };

  return (
    <div className="w-full flex p-2 text-[0.8rem] card rounded-xl opacity-[0.8] justify-between">
      <div className="flex w-full gap-4 ">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 p-1">
          <Radar color1="green" className="size-5" />
        </div>

        <div className="flex flex-col">
          <h1 className={`select-none ${pointer.erreur && "text-red-500"}`}>
            {pointer.erreur ? pointer.erreur : "Pointer ma présence"}{" "}
          </h1>
          {pointer.arrival_pointed_at ? (
            <p className="select-none text-[0.6rem]">
              Pointage {fichePointage.moment} effectué a{" "}
              {pointer.arrival_pointed_at}
            </p>
          ) : (
            <p className="select-none text-[0.6rem]">
              Pointage {fichePointage.moment} non effectué{" "}
            </p>
          )}
        </div>
      </div>
      <button
        // disabled={fichePointage.isPointé}
        onClick={handlePointer}
        className="text-black bg-(--yellow-zesteo) rounded-md self-center px-4 p-1 cursor-pointer"
      >
        {pointer.aPointé ? <Pulse /> : <p>Pointer</p>}
      </button>
    </div>
  );
}
