import { useState, useEffect } from "react";
import Jauge from "./Jauge.jsx";
import { ArrivedLocation, Location } from "./IconeStartEnd.jsx";
import BoxLivraison from "./BoxLivraison.jsx";
import Boites from "./Boites.jsx";

export default function CardLivraisonsDash({
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
      className={`${className} flex card w-full opacity-[0.8] rounded-xl text-white p-2 gap-2 select-none`}
    >
      
        <div className="flex flex-col w-full">
          {/* Titre */}
          <div className="flex w-full gap-2">
            <div className="flex h-10 w-10 bg-white/10 shrink-0 items-center justify-center rounded-full border border-white p-2 ">
              <BoxLivraison color1="yellow" className="h-full w-full" />
            </div>
            <div className="flex w-full">
              <h1 className="text-[0.8rem] w-full flex justify-between">
                {titre}
                <span className="rounded-xl px-2 bg-green-700/20 text-green-400 self-start">
                  En cours
                </span>
              </h1>
            </div>
          </div>
          <div className="flex w-full pt-2 items-evenly">
          {/* Details */}
          <div className="flex w-1/2 shrink-0 items-center">
            {/* Icone de card */}
            <div className="flex flex-col gap-6 text-[0.7rem]">
              {/* div de section */}
              <div className="flex w-full gap-2">
                <div className="w-[10vw] aspect-square">
                  <Location className="w-full h-full" />
                </div>
                <div className="flex flex-col w-full">
                  <h1 className="flex items-start">Depart</h1>
                  <p className=" break-words whitespace-normal text-[0.6rem]">
                    {depart}
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-2">
                <div className="w-[10vw] aspect-square">
                  <ArrivedLocation className="w-full h-full" />
                </div>
                <div className="flex flex-col w-full">
                  <h1 className="font-bold flex items-start">Arrivée</h1>
                  <p className=" break-words whitespace-normal text-[0.6rem]">
                    {arrivee}
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-2">
                <div className="w-[10vw] aspect-square">
                  <Boites className="w-full h-full" />
                </div>
                <div className="flex flex-col w-full">
                  <h1 className="font-bold flex items-start">Produits</h1>
                  <p className=" break-words whitespace-normal text-[0.6rem]">
                    {produits}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Jauge */}
          <div className="flex w-1/2">
            <div className="flex flex-row gap-2 justify-between">
              <div className="flex relative flex-col gap-4 border-l border-white/30 pl-4 -mt-4">
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
          </div></div>
        </div>
      </div>
   
  );
}
