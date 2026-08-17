import { useState, useEffect, useContext } from "react";
import Radar from "../componentsIcone/Radar.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import Pulse from "../Loading.jsx";
import { PointageContext } from "../../contexte/pointageContext.jsx";
import Coffee from "../componentsIcone/Coffee.jsx";
import CoffeeBared from "../componentsIcone/CoffeeBared.jsx";
import Sun from "../componentsIcone/Sun.jsx";
import Moon from "../componentsIcone/Moon.jsx";
import LinearBarProgress from "../componentsIcone/LineaireBarProgress.jsx";

export default function CardPointage() {
  const { pointage, setPointage } = useContext(PointageContext);

  const [isLoading, setIsLoading] = useState(false);
  const [maintenant, setMaintenant] = useState(Date.now());

  useEffect(() => {
    if (!pointage.start_pause_pointed_at || pointage.end_pause_pointed_at) return;
    const intervalle = window.setInterval(() => setMaintenant(Date.now()), 30000);
    return () => window.clearInterval(intervalle);
  }, [pointage.start_pause_pointed_at, pointage.end_pause_pointed_at]);

  const pauseDepassee = Boolean(
    pointage.start_pause_pointed_at &&
    !pointage.end_pause_pointed_at &&
    maintenant - new Date(pointage.start_pause_pointed_at).getTime() >= 45 * 60 * 1000
  );


  const valeurPointage = [
    {
      lien: pointage.arrival_pointed_at,
      moment: "Je suis arrivé au travail à ",
      icone: Sun,
    },
    {
      lien: pointage.start_pause_pointed_at,
      moment: "Je commence ma pause à ",
      icone: Coffee,
    },
    {
      lien: pointage.end_pause_pointed_at,
      moment: "Je finis ma pause à ",
      icone: CoffeeBared,
    },
    {
      lien: pointage.departure_pointed_at,
      moment: "Je quitte le travail à ",
      icone: Moon,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    apiFetch("/recup/pointages", "GET")
      .then((res) => res.json())
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
      .finally(() => {
        setIsLoading(false);
      });
  }, [setPointage]);

  const handlePointer = async () => {
    try {
      setIsLoading(true);

      const res = await apiFetch("/pointed/assign", "POST");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.erreur || "Erreur pointage");
      }

      setPointage((prev) => ({
        ...prev,
        arrival_pointed_at: data?.arrival_pointed_at ?? null,
        start_pause_pointed_at: data?.start_pause_pointed_at ?? null,
        end_pause_pointed_at: data?.end_pause_pointed_at ?? null,
        departure_pointed_at: data?.departure_pointed_at ?? null,
        erreur: null,
      }));
    } catch (error) {
      console.error(error);

      setPointage((prev) => ({
        ...prev,
        erreur: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const prochainPointage = valeurPointage.find((item) => !item.lien);
  const Icone = prochainPointage?.icone;

  return (
    <div className="w-full flex p-2 text-[0.8rem] card rounded-xl opacity-[0.8] justify-between">
      <div className="flex w-full gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/70 p-1">
          <Radar color1="green" className="size-5" />
        </div>

        <div className="flex flex-col w-full">
          {pauseDepassee && (
            <div role="alert" className="mb-2 rounded-lg border border-orange-400/40 bg-orange-500/15 px-3 py-2 text-xs text-orange-200">
              Ta pause dépasse 45 minutes. Pense à pointer ta fin de pause.
            </div>
          )}
          <h1 className={`select-none ${pointage.erreur && "text-red-500"}`}>
            {pointage.erreur ? pointage.erreur : "Pointer ma présence"}{" "}
          </h1>
          {!pointage.arrival_pointed_at && (
            <p className="text-[0.6rem]">Veuillez pointer votre journée...</p>
          )}
          {/* <p className="select-none text-[0.6rem]">{moment}</p> */}

          <LinearBarProgress
            className="w-full pr-4 py-2"
            progress={2}
            max={8}
          ></LinearBarProgress>

          {valeurPointage.map((item, index) => {
            return (
              <p
                key={index}
                className="flex select-none items-center gap-2 text-[0.6rem]"
              >
                {item.lien && (
                  <>
                    <span>
                      {item.moment}{" "}
                      {new Date(item.lien).toLocaleTimeString("fr-FR")}
                    </span>
                  </>
                )}
              </p>
            );
          })}
        </div>
      </div>
      {pointage.departure_pointed_at === null && (
        <button
          disabled={isLoading || pointage.departure_pointed_at !== null}
          onClick={handlePointer}
          className="border text-black bg-(--yellow-zesteo) rounded-md self-center px-4 p-1 cursor-pointer"
        >
          {isLoading ? (
            <Pulse className="flex w-10 px-2" />
          ) : (
            <div className="flex items-center gap-2" color1="black">
              Pointer {Icone && <Icone color1="black" className="size-4 flex items-center" />}
            </div>
          )}
        </button>
      )}
    </div>
  );
}
