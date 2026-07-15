import UserIcone from "../../components/componentsIcone/UserIcone.jsx";
import ShopIcone from "../../components/componentsIcone/ShopIcone.jsx";
import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import SecteurIcone from "../../components/componentsIcone/SecteurIcone.jsx";
import PlanningIcone from "../../components/componentsIcone/PlanningIcone.jsx";
import IncidentsIcone from "../../components/componentsIcone/IncidentIcone.jsx";
import StatsIcone from "../../components/componentsIcone/StatsIcone.jsx";
import GestionUsersIcone from "../../components/componentsIcone/GestionUsersIcone.jsx";
import CardAdministration from "./CardAdministration.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import { useContext } from "react";

export default function Administration() {
  const { user } = useContext(UserContext);

  const listeIcones = [
    {
      titre: "Mes Livreurs",
      composant: UserIcone,
      roleOk: ["Livreur"],
    },
    {
      titre: "Mes Agences",
      composant: ShopIcone,
      roleOk: ["Livreur"],
    },
    {
      titre: "Mes Camions",
      composant: CamionIcone,
      roleOk: ["Livreur"],
    },
    {
      titre: "Mes Secteurs",
      composant: SecteurIcone,
      roleOk: ["Livreur"],
    },
    {
      titre: "Plannings",
      composant: PlanningIcone,
      roleOk: ["Livreur"],
    },
    {
      titre: "Incidents",
      composant: IncidentsIcone,
      roleOk: ["Livreur"],
    },

    {
      titre: "Statistiques",
      composant: StatsIcone,
      roleOk: ["Livreur"],
    },
    {
      titre: "Gestion",
      composant: GestionUsersIcone,
      roleOk: ["Livreur"],
    },
  ];

  const iconesAutorisees = listeIcones.filter((item) =>
    item.roleOk?.includes(user?.role),
  );

  // Mes livreurs · Mes agences · Mes camions · Mes secteurs · Planning · Incidents · Statistiques · Comptes utilisateurs

  return (
    <div className="flex flex-col gap-4 w-full h-full px-4 border border-red-500 text-[0.8rem] ">
      <div className="w-full border flex border-blue-500">
        <div className="flex flex-col w-full border border-yellow-500">
          <div className="flex justify-between px-4 py-2">
            <h1 className="font-bold text-[1rem] flex items-center justify-center gap-2">
              <StatsIcone color1="var(--yellow-zesteo)" height={15} width={15} />
              Vue d'ensemble
            </h1>
            <p className="text-[0.6rem] button_system_green px-2 rounded-xl gap-1">
              <span className="rounded-full m-1 bg-green-500 size-2" /> Systeme
              operationnel
            </p>
          </div>
          <div className="grid grid-cols-3 w-full border gap-2 p-2">
            <div className="border flex justify-center items-center">pouet</div>
            <div className="border flex justify-center items-center">pouet</div>
            <div className="border flex justify-center items-center">pouet</div>
            
            
          </div>

        </div>

      </div>
    <CardAdministration
  icone={
    <IncidentsIcone
      width={38}
      height={38}
      color1="#fb7185"
    />
  }
  titre="Incidents"
  description="Signalements terrain"
  statut="1 ouvert"
  couleur="#e11d48"
  couleurFond="#160d24"
  couleurStatut="#f43f5e"
  onClick={() => setPage("incidents")}
/>
      {/* {iconesAutorisees.map((item, index) => {
        const Icone = item.composant;
        return (
          <div key={index} className="aspect-square cursor-pointer">
            <Icone
              titre={item.titre}
              tailleTexte="text-[1rem]"
              height="30"
              width="30"
              className={
                "h-full flex justify-center items-center cardAdmin rounded-xl"
              }
            />
          </div>
        );
      })} */}

      {/* <div className="aspect-square cursor-pointer">
        <UserIcone
          titre={"Mes Livreurs"}
          tailleTexte="text-[1rem]"
          height="30"
          width="30"
          className={
            "h-full flex justify-center items-center cardLiv rounded-xl"
          }
        />
      </div>
      <div className="aspect-square cursor-pointer">
        <Shop
          titre={"Mes Agences"}
          tailleTexte="text-[1rem]"
          height="30"
          width="30"
          className={
            "h-full flex justify-center items-center cardLiv rounded-xl"
          }
        />
      </div>
      <div className="aspect-square cursor-pointer">
        <Camion
          titre={"Mes Camions"}
          tailleTexte="text-[1rem]"
          height="30"
          width="30"
          className={
            "h-full flex justify-center items-center cardLiv rounded-xl"
          }
        />
      </div>
      <div className="aspect-square cursor-pointer">
        <UserIcone
          className={
            "h-full flex justify-center items-center cardLiv rounded-xl"
          }
        />
      </div>
      <div className="aspect-square cursor-pointer">
        <UserIcone
          className={
            "h-full flex justify-center items-center cardLiv rounded-xl"
          }
        />
      </div>
      <div className="aspect-square cursor-pointer">
        <UserIcone
          className={
            "h-full flex justify-center items-center cardLiv rounded-xl"
          }
        />
      </div> */}
    </div>
  );
}
