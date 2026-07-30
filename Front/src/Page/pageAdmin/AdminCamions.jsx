import React from "react";
import CamionIcone from "../../components/componentsIcone/CamionIcone";

export default function AdminCamions() {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center text-xl p-4">
      <h1>Mes camions</h1>
      <div className="w-full flex border size-fit">
        <CamionIcone reverse height={150} width={150} className="-my-8" />{" "}
        <div className="flex"></div>
      </div>
    </div>
  );
}
