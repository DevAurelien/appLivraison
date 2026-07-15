import UserIcone from "../../components/componentsIcone/UserIcone.jsx";
import ShopIcone from "../../components/componentsIcone/ShopIcone.jsx";
import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import SecteurIcone from "../../components/componentsIcone/SecteurIcone.jsx";
import PlanningIcone from "../../components/componentsIcone/PlanningIcone.jsx";
import IncidentsIcone from "../../components/componentsIcone/IncidentIcone.jsx"
import StatsIcone from "../../components/componentsIcone/StatsIcone.jsx"
import GestionUsersIcone from "../../components/componentsIcone/GestionUsersIcone.jsx"
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
    }, {
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
    <div className="grid grid-cols-3 gap-4 w-full p-4">
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
