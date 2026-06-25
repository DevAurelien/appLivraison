import { useState, useEffect } from "react";
import Jauge from "./Jauge.jsx";
import Boite from "./Boite.jsx";
import { ArrivedLocation, Location } from "./IconeStartEnd.jsx";
import BoxLivraison from "./BoxLivraison.jsx";

export default function CardLivraisons({
  className,
  titre,
  depart = "",
  arrivee = "",
  produits = "",
}) {
  const [totalLivraisons, setTotalLivraisons] = useState(30);
  const livraisonsFaite = 13;

  return (
    <div
      className={`${className} flex card w-full opacity-[0.8] rounded-xl text-white p-2 gap-2`}
    >
      <div className="flex w-20 shrink-0 flex-col items-center gap-4 p-2">
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 p-3 -translate-x-4 -translate-y-2">
    <BoxLivraison className="h-full w-full" />
  </div>

  <div className="w-full aspect-square">
    <Location className="w-full h-full" />
  </div>

  <div className="w-full aspect-square">
    <ArrivedLocation className="w-full h-full" />
  </div>

  <div className="w-full aspect-square">
    <Boite className="w-full h-full" />
  </div>
</div>

      <div className="flex flex-col w-full">
        <h1 className="text-[0.9rem] w-full flex justify-between">
          {titre}<span className="rounded-xl px-2 bg-green-700 font-bold">En cours</span>
        </h1>
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-col w-1/2 min-w-0 justify-start items-start pt-4">
            <div className=" text-white/80 flex flex-col justify-between items-start gap-2">
              <h1 className="relative font-bold">Depart</h1>
              <p className=" break-words whitespace-normal text-[0.8rem]">{depart}</p>
              <h1 className="relative font-bold">Arrivée</h1>
              <p className=" break-words whitespace-normal text-[0.8rem]">{arrivee}</p>
              <p className="w-full min-w-0 break-all whitespace-normal overflow-hidden text-[0.8rem]">
                {produits}
              </p>
            </div>
          </div>
          <div className="w-1/2 flex relative flex-col gap-4 border-l border-white/30 pl-4 p-2">
            <div className="relative mx-auto aspect-square w-full max-w-[130px]">
              <Jauge
                className="h-full w-full"
                livraisonsFaite={livraisonsFaite}
                totalLivraisons={totalLivraisons}
              />

              <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center leading-tight">
                <span className="text-lg font-bold">
                  {livraisonsFaite}/{totalLivraisons}
                </span>

                <span className="text-[0.6rem] font-semibold">
                  livraisons <br className="md:hidden" /> effectuées
                </span>
              </div>
            </div>

            <button className="cursor-pointer hover:bg-yellow-500 hover:text-black hover:scale-[1.1] duration-200 transition-transform ease-in-out flex text-yellow-200 justify-center items-center outline outline-blue-200/30 rounded-md text-[0.7rem] p-1 font-light text-nowrap">
              Voir ma tournée
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
