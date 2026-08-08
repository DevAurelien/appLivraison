import React, { useState } from "react";
import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import PlaqueImmatriculation from "../../components/componentsIcone/ImmatPlaque.jsx";
import DriverIcone from "../../components/componentsIcone/DriverIcone.jsx";
import RippeurIcone from "../../components/componentsIcone/RippeurIcone.jsx";
import truck from "../../assets/truck.png";
import StatutCard from "../../components/componentsCard/StatutCard.jsx";
import { Location } from "../../components/componentsIcone/IconeStartEnd.jsx";
import PlusIcone from "../../components/componentsIcone/PlusIcone.jsx";

export default function AdminCamions() {
  const [openForm, setOpenForm] = useState(false);

  const salaries = [{ driver: "Theo" }, { rippeur: "Gaetan" }];
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center p-4">
      {!openForm && (
        <div className="flex flex-col items-center gap-2">
          {" "}
          <h1 className="text-xl">Mes camions</h1>
          <div className="w-full flex size-fit rounded-2xl card">
            <div className="w-2/5 relative pt-4">
              <div className="card2 absolute m-2 px-1 rounded-md top-0 left-0">
                <h1 className="text-(--yellow-zesteo) text-[0.6rem] border-(--yellow-zesteo-border) ">
                  Equipe 1
                </h1>
              </div>
              <img src={truck} alt="Camion" className="scale-[1.5]" />
            </div>
            <div className=" h-full flex flex-col w-3/5 px-4 p-2">
              <StatutCard couleurFond="var(--success)" statut="Pret" />

              <PlaqueImmatriculation
                className="w-full h-4/5"
                immatriculation="GK-822-PX"
              />
              <div className="flex gap-2 text-[0.8rem] py-1 border-b border-(--border-default)">
                {salaries.map((sal, index) => (
                  <p className="flex gap-2" key={index}>
                    {sal.driver ? (
                      <DriverIcone className="size-4 flex" />
                    ) : null}
                    {sal.driver}
                    {sal.rippeur}{" "}
                    {sal.rippeur ? (
                      <RippeurIcone className="size-4 flex" />
                    ) : null}
                  </p>
                ))}
              </div>
              <div className="flex pt-1 gap-2">
                <Location className="size-4" />
                <h1 className="text-[0.8rem]">Toulouse, 31</h1>
              </div>
            </div>
          </div>
        </div>
      )}
      <form className="relative flex justify-center w-full">
        {!openForm && (
          <button
            onClick={() => setOpenForm(!openForm)}
            className="z-5 flex w-4/5 gap-2 cursor-pointer items-center justify-center rounded-xl bg-yellow-300 px-4 py-2 text-black disabled:cursor-not-allowed"
          >
            <PlusIcone className="size-6 p-1" color1="black" /> Ajouter un
            camion
          </button>
        )}
        {openForm && 
          <div className=" w-full flex flex-col h-full gap-2">
            <div className="relative w-full aspect-16/10 flex rounded-xl p-2 shrink-0 bgCreaCamion" ><div className=""><h1 className="p-2 absolute top-2 left-0">Créer<br/> un camion</h1></div> </div>
          </div>}
      </form>
    </div>
  );
}

// TODO refaire en card, faire un bg radiant, fleche >, anim scale, card w-2/3
