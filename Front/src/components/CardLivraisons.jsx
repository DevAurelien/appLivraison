import { useState, useEffect } from "react";
import Jauge from "./Jauge";

export default function CardLivraisons({ className, children, titre }) {

    const [totalLivraisons, setTotalLivraisons] = useState(30);
    const livraisonsFaite = 13;
  
    
  return (
    <div
      className={`${className} flex card w-full opacity-[0.8] rounded-xl text-white p-2 gap-2`}
    >
      <div className="flex flex-col w-[2/8] items-start border border-red-200">
        pouet
      </div>

      <div className="flex flex-col w-full border border-green-800">
        <h1 className="text-[0.9rem] w-full flex border border-white">
          {titre}
        </h1>
        <div className="flex flex-row gap-4 justify-between p-2">
          <div className="flex flex-col w-[1/2] justify-start items-start gap-2 p-2 border border-red-200">
            <div className="text-[0.7rem] text-white/80">{children}</div>
          </div>
          <div className="w-1/2 flex relative flex-col gap-4 border-l border-white/30 pl-4">
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

  <button className="flex text-yellow-200 justify-center items-center outline outline-blue-200/30 rounded-md text-[0.7rem] p-1 font-light text-nowrap">
    Voir ma tournée
  </button>
</div>
        </div>
      </div>
    </div>
  );
}
