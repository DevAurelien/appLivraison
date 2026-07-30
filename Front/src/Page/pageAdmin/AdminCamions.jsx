import React from "react";
import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import PlaqueImmatriculation from "../../components/componentsIcone/ImmatPlaque.jsx";
import DriverIcone from "../../components/componentsIcone/DriverIcone.jsx";
import RippeurIcone from "../../components/componentsIcone/RippeurIcone.jsx";


export default function AdminCamions() {

    const salaries = [{driver:"Theo"},{rippeur:"Gaetan"}]
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center p-4">
      <h1 className="text-xl">Mes camions</h1>
      <div className="w-full flex size-fit rounded-2xl card">
        <CamionIcone reverse height={160} width={160} className="-my-9" />{" "}
        <div className=" h-full flex flex-col w-2/3 -ml-2 px-4 p-1">
            <h1 className="text-(--yellow-zesteo)">Equipe 1</h1>
            <PlaqueImmatriculation className="w-fit" immatriculation="GK-822-PX"/>
            <div className="flex gap-2 text-[0.8rem]">{salaries.map((sal, index)=><p className="flex gap-1" key={index}>{sal.driver}{sal.rippeur} {sal.driver ? <DriverIcone className="size-4 flex"/> : null}{sal.rippeur ? <RippeurIcone className="size-4 flex"/> : null}</p>)}</div>
        </div>
      </div>
    </div>
  );
}
