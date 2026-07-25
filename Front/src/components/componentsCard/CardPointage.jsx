import { useState, useEffect, useContext } from "react";
import Radar from "../componentsIcone/Radar.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import Pulse from "../Loading.jsx";
import { PointageContext } from "../../contexte/pointageContext.jsx";

export default function CardPointage() {
  const { pointage, setPointage } = useContext(PointageContext);

  const [moment, setMoment] = useState("du matin");
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);
  // const [mesPointages, setMesPointages] = useState([]);

  useEffect(() => {
    if (!pointage.arrival_pointed_at) {
      setMoment("Je suis arrivé au travail à ");
    } else if (!pointage.start_pause_pointed_at) {
      setMoment("Je commence ma pause à ");
    } else if (!pointage.end_pause_pointed_at) {
      setMoment("Je finis ma pause à ");
    } else if (!pointage.departure_pointed_at) {
      setMoment("Je quitte le travail à ");
    } else setMoment("Fin de la journée");
  }, [pointage]);

  const valeurPointage = [
    {
      lien: pointage.arrival_pointed_at,
      moment: "Je suis arrivé au travail à ",
    },
    {
      lien: pointage.start_pause_pointed_at,
      moment: "Je commence ma pause à ",
    },
    { lien: pointage.end_pause_pointed_at, moment: "Je finis ma pause à " },
    { lien: pointage.departure_pointed_at, moment: "Je quitte le travail à " },
    { lien: "", moment: "Fin de la journée" },
  ];

  const handlePointer = async () => {
    setIsLoading(true);
    //  if (user?.heurePointage) return;
    const dateActuelle = new Date();

    apiFetch(`/pointed/assign/`, "POST")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur pointage");
        return res.json();
      })
      .then((data) => {
        setPointage((prev) => ({
          ...prev,
          arrival_pointed_at: data?.arrival_pointed_at ?? null,
          start_pause_pointed_at: data?.start_pause_pointed_at ?? null,
          end_pause_pointed_at: data?.end_pause_pointed_at ?? null,
          departure_pointed_at: data?.departure_pointed_at ?? null,
          erreur: data?.erreur ?? null,
        }));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="w-full flex p-2 text-[0.8rem] card rounded-xl opacity-[0.8] justify-between">
      <div className="flex w-full gap-4 ">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 p-1">
          <Radar color1="green" className="size-5" />
        </div>

        <div className="flex flex-col">
          <h1 className={`select-none ${pointage.erreur && "text-red-500"}`}>
            {pointage.erreur ? pointage.erreur : "Pointer ma présence"}{" "}
          </h1>

{/* TODO Recup */}
          {/* <p className="select-none text-[0.6rem]">{moment}</p> */}
          {valeurPointage.map((item, index) => (
            <p key={index} className="select-none text-[0.6rem]">
              {item.lien ? (
                <span>
                  {item.moment}{" "}
                  {new Date(item.lien).toLocaleTimeString("fr-FR")}
                </span>
              ) : null}
            </p>
          ))}
        </div>
      </div>
      <button
        // disabled={fichePointage.isPointé}
        onClick={handlePointer}
        className="text-black bg-(--yellow-zesteo) rounded-md self-center px-4 p-1 cursor-pointer"
      >
        {isLoading ? <Pulse className="flex w-10 px-2" /> : <p>Pointer</p>}
      </button>
    </div>
  );
}
