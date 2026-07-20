import UserIcone from "../../components/componentsIcone/UserIcone.jsx";
import ShopIcone from "../../components/componentsIcone/ShopIcone.jsx";
import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import SecteurIcone from "../../components/componentsIcone/SecteurIcone.jsx";
import PlanningIcone from "../../components/componentsIcone/PlanningIcone.jsx";
import IncidentsIcone from "../../components/componentsIcone/IncidentIcone.jsx";
import StatsIcone from "../../components/componentsIcone/StatsIcone.jsx";
import GestionUsersIcone from "../../components/componentsIcone/GestionUsersIcone.jsx";
import LoupeIcone from "../../components/componentsIcone/LoupeIcone.jsx";
import DangerIcone from "../../components/componentsIcone/DangerIcone.jsx";
import CardAdministration from "./CardAdministration.jsx";
import PetiteCardAdmin from "./PetiteCardAdmin.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import { useContext, useState } from "react";
import { MenuContext } from "../../contexte/menuContext.jsx";

export default function Administration() {
  const { user } = useContext(UserContext);
  const {setPage} = useContext(MenuContext)
  const [inputSearch, setInputSearch] = useState("");
  const listeIcones = [
    {
      titre: "Mes Livreurs",
      description: "Gerer vos équipes",
      composant: UserIcone,
      statut: "12 actifs",
      couleur: "#134BBE",
      roleOk: ["Livreur"],
      onclick:()=>setPage("AdminLivreurs")
    },
    {
      titre: "Mes Agences",
      description: "Sites et dépôts",
      composant: ShopIcone,
      statut: "3 agences",
      couleur: "#391D9D",
      roleOk: ["Livreur"],
    },
    {
      titre: "Mes Camions",
      description: "Suivi de la flotte",
      composant: CamionIcone,
      statut: "8 camions",
      couleur: "#086184",
      roleOk: ["Livreur"],
    },
    {
      titre: "Mes Secteurs",
      description: "Zones d'intervention",
      composant: SecteurIcone,
      statut: "6 secteurs",
      couleur: "#146845",
      roleOk: ["Livreur"],
    },
    {
      titre: "Plannings",
      description: "Tournées et affectations",
      composant: PlanningIcone,
      statut: "5 en cours",
      couleur: "#93681D",
      roleOk: ["Livreur"],
    },
    {
      titre: "Incidents",
      description: "Signalements terrain",
      composant: IncidentsIcone,
      statut: "1 ouvert",
      couleur: "#7A213A",
      roleOk: ["Livreur"],
    },

    {
      titre: "Statistiques",
      description: "Analyses et rapports",
      composant: StatsIcone,
      statut: "A jour",
      couleur: "#87471C",
      roleOk: ["Livreur"],
    },
    {
      titre: "Gestion",
      description: "Paramètres et outils",
      composant: GestionUsersIcone,
      statut: user.role,
      couleur: "#3C4D6D",
      roleOk: ["Livreur"],
      onclick:()=>setPage("AdminGestions")
    },
  ];

  const iconesAutorisees = listeIcones.filter((item) =>
    item.roleOk?.includes(user?.role),
  );

  // Mes livreurs · Mes agences · Mes camions · Mes secteurs · Planning · Incidents · Statistiques · Comptes utilisateurs

  return (
    <div className="flex flex-col gap-4 w-full px-4 text-[0.8rem] overflow-y-scroll overflow-x-hidden pb-25">
      <div className="w-full border border-(--primary)/50 shadow-md shadow-black/80 rounded-2xl flex">
        <div className="flex flex-col w-full pb-2">
          <div className="flex justify-between px-4 py-2">
            <h1 className="font-bold text-[1rem] flex items-center justify-center gap-2">
              <StatsIcone
                color1="var(--yellow-zesteo)"
                height={15}
                width={15}
              />
              Vue d'ensemble
            </h1>
            <p className="text-[0.6rem] button_system_green px-2 rounded-xl gap-1">
              <span className="rounded-full m-1 bg-green-500 size-2" /> Systeme
              operationnel
            </p>
          </div>
          <div className="grid grid-cols-3 w-full px-2 gap-2 pb-1 pointer-events-none">
            <PetiteCardAdmin
              icone={UserIcone}
              max={3}
              detail="Livreurs actifs"
              afficherLivreur
            />
            <PetiteCardAdmin
              icone={CamionIcone}
              statut="couleurCamions"
              detail="Tournées en cours"
              nb={2}
              max={3}
              afficherBarre
            />
            <PetiteCardAdmin
              icone={DangerIcone}
              statut="danger"
              nb={0}
              detail={"Incidents en cours"}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <div className="w-full flex gap-2">
          <span className="w-[1vw] bg-(--yellow-zesteo) "></span>{" "}
          <h1 className="text-xl font-bold">Gestion</h1>
        </div>{" "}
        <div className="relative h-full">
          {inputSearch === "" && (
            <LoupeIcone
              className="px-2 absolute left-0 top-1/2 -translate-y-1/2"
              height={12}
              width={12}
            />
          )}{" "}
          <input
            type="text"
            value={inputSearch}
            onChange={(e) => {
              setInputSearch(e.target.value);
            }}
            placeholder="Rechercher un paramètre"
            className="placeholder:text-[0.6rem] h-8 placeholder:text-white/25 text-right border-2 border-(--card-bg-soft) rounded-2xl outline-none px-2 bg-black/25"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 ">
        {iconesAutorisees.map((item, index) => {
          const Icone = item.composant;
          return (
            <CardAdministration
              key={index}
              icone={<Icone color1="white" height={25} width={25} />}
              titre={item.titre}
              description={item.description}
              statut={(item.statut && item.statut) || null}
              // couleur="#e11d48"
              couleur={item.couleur}
              // couleurFond={item.couleur}
              couleurFond="#160d24"
              onClick={item.onclick || null}
              // couleurStatut="#f43f5e"
              // onClick={() => setPage("incidents")}
            />
          );
        })}
      </div>
    </div>
  );
}

