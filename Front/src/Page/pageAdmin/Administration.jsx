import { useContext, useEffect, useState } from "react";

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
import { MenuContext } from "../../contexte/menuContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";

export default function Administration() {
  const { user } = useContext(UserContext);
  const { setPage } = useContext(MenuContext);

  const [inputSearch, setInputSearch] = useState("");
  const [indicateurs, setIndicateurs] = useState(null);

  useEffect(() => {
    let actif = true;
    apiFetch("/administration/tableau-de-bord")
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Indicateurs indisponibles");
        if (actif) setIndicateurs(data.donnees);
      })
      .catch((error) => console.error("Chargement du tableau de bord :", error));
    return () => { actif = false; };
  }, []);

  const permissionsUtilisateur = Array.isArray(user?.permissions)
    ? user.permissions
    : [];

  const listeIcones = [
    {
      titre: "Mes Livreurs",
      description: "Gérer vos équipes",
      composant: UserIcone,
      statut: indicateurs ? `${indicateurs.salaries_actifs} actif${indicateurs.salaries_actifs > 1 ? "s" : ""}` : "Chargement…",
      couleur: "var(--couleurLivreurs)",
      couleurFond: "var(--couleurLivreursBg)",
      couleurBordure: "var(--couleurLivreursBorder)",

      permissionsRequises: [
        "UTILISATEURS_LIRE",
        "UTILISATEURS_MODIFIER",
        "AGENCES_AFFECTER_SALARIE",
        "CAMIONS_AFFECTER_EQUIPAGE",
      ],

      onClick: () => setPage("AdminLivreurs"),
    },
    {
      titre: "Mes Agences",
      description: "Sites et dépôts",
      composant: ShopIcone,
      statut: indicateurs ? `${indicateurs.agences_actives} active${indicateurs.agences_actives > 1 ? "s" : ""}` : "Chargement…",
      couleur: "var(--couleurAgences)",
      couleurFond: "var(--couleurAgencesBg)",
      couleurBordure: "var(--couleurAgencesBorder)",

      permissionsRequises: [
        "AGENCES_LIRE",
        "AGENCES_CREER",
        "AGENCES_MODIFIER",
        "AGENCES_SUPPRIMER",
      ],

      onClick: () => setPage("AdminAgences"),
    },
    {
      titre: "Mes Camions",
      description: "Suivi de la flotte",
      composant: CamionIcone,
      statut: indicateurs ? `${indicateurs.camions_disponibles} disponible${indicateurs.camions_disponibles > 1 ? "s" : ""}` : "Chargement…",
      couleur: "var(--couleurCamions)",
      couleurFond: "var(--couleurCamionsBg)",
      couleurBordure: "var(--couleurCamionsBorder)",

      permissionsRequises: [
        "CAMIONS_LIRE",
        "CAMIONS_CREER",
        "CAMIONS_MODIFIER",
        "CAMIONS_SUPPRIMER",
        "CAMIONS_AFFECTER_EQUIPAGE",
      ],

      onClick: () => setPage("AdminCamions"),
    },
    {
      titre: "Mes Secteurs",
      description: "Zones d'intervention",
      composant: SecteurIcone,
      statut: indicateurs ? `${indicateurs.secteurs_actifs} actif${indicateurs.secteurs_actifs > 1 ? "s" : ""}` : "Chargement…",
      couleur: "var(--couleurSecteurs)",
      couleurFond: "var(--couleurSecteursBg)",
      couleurBordure: "var(--couleurSecteursBorder)",

      permissionsRequises: [
        "SECTEURS_LIRE",
        "SECTEURS_CREER",
        "SECTEURS_MODIFIER",
        "SECTEURS_SUPPRIMER",
      ],

      onClick: () => setPage("AdminSecteurs"),
    },
    {
      titre: "Plannings",
      description: "Tournées et affectations",
      composant: PlanningIcone,
      statut: indicateurs ? `${indicateurs.tournees_realisees} réalisée${indicateurs.tournees_realisees > 1 ? "s" : ""}` : "Chargement…",
      couleur: "var(--couleurPlannings)",
      couleurFond: "var(--couleurPlanningsBg)",
      couleurBordure: "var(--couleurPlanningsBorder)",

      permissionsRequises: [
        "PLANNING_LIRE",
        "PLANNING_CREER",
        "PLANNING_MODIFIER",
        "PLANNING_REPLANIFIER",
        "PLANNING_SUPPRIMER",
      ],

      onClick: () => setPage("AdminPlannings"),
    },
    {
      titre: "Incidents",
      description: "Signalements terrain",
      composant: IncidentsIcone,
      statut: indicateurs ? `${indicateurs.incidents_ouverts} ouvert${indicateurs.incidents_ouverts > 1 ? "s" : ""}` : "Chargement…",
      couleur: "var(--couleurIncidents)",
      couleurFond: "var(--couleurIncidentsBg)",
      couleurBordure: "var(--couleurIncidentsBorder)",
      couleurStatut: "var(--danger)",

      permissionsRequises: [
        "INCIDENTS_LIRE",
        "INCIDENTS_CREER",
        "INCIDENTS_MODIFIER",
        "INCIDENTS_CLOTURER",
      ],

      onClick: () => setPage("AdminIncidents"),
    },
    {
      titre: "Statistiques",
      description: "Analyses et rapports",
      composant: StatsIcone,
      statut: indicateurs?.statistiques_a_jour ? "À jour" : "Vérification…",
      couleur: "var(--couleurStatistiques)",
      couleurFond: "var(--couleurStatistiquesBg)",
      couleurBordure: "var(--couleurStatistiquesBorder)",

     
      permissionsRequises: [
        "LIVRAISONS_LIRE_TOUTES",
        "POINTAGES_LIRE_TOUS",
        "FACTURES_LIRE",
        "COMPTABILITE_LIRE",
      ],

      onClick: () => setPage("AdminStatistiques"),
    },
    {
      titre: "Gestion",
      description: "Paramètres et outils",
      composant: GestionUsersIcone,
      statut: user?.role_code === "GM" ? null : user?.role ?? null,
      couleur: "var(--couleurGestions)",
      couleurFond: "var(--couleurGestionsBg)",
      couleurBordure: "var(--couleurGestionsBorder)",

      permissionsRequises: [
        "ROLES_LIRE",
        "ROLES_MODIFIER",
        "ROLES_GERER_PERMISSIONS",
        "UTILISATEURS_MODIFIER_ROLE",
        "SYSTEME_ADMINISTRER",
      ],

      onClick: () => setPage("AdminGestions"),
    },
  ];

  const iconesAutorisees = listeIcones
    .filter((item) =>
      item.permissionsRequises.some((permission) =>
        permissionsUtilisateur.includes(permission),
      ),
    )
    .filter((item) => {
      const recherche = inputSearch.trim().toLowerCase();

      if (!recherche) {
        return true;
      }

      return (
        item.titre.toLowerCase().includes(recherche) ||
        item.description.toLowerCase().includes(recherche)
      );
    });

  return (
    <div className="flex w-full flex-col gap-4 overflow-x-hidden overflow-y-scroll px-4 pb-44 text-[0.8rem]">
      <div className="admin-overview flex w-full rounded-2xl">
        <div className="flex w-full flex-col pb-2">
          <div className="flex justify-between px-4 py-2">
            <h1 className="flex items-center justify-center gap-2 text-[1rem] font-bold">
              <StatsIcone
                color1="var(--yellow-zesteo)"
                height={15}
                width={15}
              />

              Vue d'ensemble
            </h1>

            <p className="button_system_green gap-1 rounded-xl px-2 text-[0.6rem]">
              <span className="m-1 size-2 rounded-full bg-(--success)" />
              Système opérationnel
            </p>
          </div>

          <div className="pointer-events-none grid w-full grid-cols-3 gap-2 px-2 pb-1">
            <PetiteCardAdmin
              icone={UserIcone}
              nb={indicateurs?.salaries_actifs ?? 0}
              max={Math.max(1, indicateurs?.salaries_total ?? 0)}
              nbAbsents={Math.max(0, (indicateurs?.salaries_total ?? 0) - (indicateurs?.salaries_actifs ?? 0))}
              detail="Salariés actifs"
              afficherLivreur
            />

            <PetiteCardAdmin
              icone={CamionIcone}
              statut="couleurCamions"
              detail="Tournées réalisées"
              nb={indicateurs?.tournees_realisees ?? 0}
              max={Math.max(1, indicateurs?.tournees_total_jour ?? 0)}
              afficherBarre
            />

            <PetiteCardAdmin
              icone={DangerIcone}
              statut="danger"
              nb={indicateurs?.incidents_ouverts ?? 0}
              detail="Incidents en cours"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between gap-3">
        <div className="flex w-full gap-2">
          <span className="w-[1vw] shrink-0 bg-(--yellow-zesteo)" />

          <h1 className="text-xl font-bold">Gestion</h1>
        </div>

        <div className="relative h-full">
          {inputSearch === "" && (
            <LoupeIcone
              className="absolute top-1/2 left-0 -translate-y-1/2 px-2"
              height={12}
              width={12}
            />
          )}

          <input
            type="text"
            value={inputSearch}
            onChange={(event) => setInputSearch(event.target.value)}
            placeholder="Rechercher un paramètre"
            className="
              h-8
              rounded-2xl
              border-2
              border-(--border-soft)
              bg-black/25
              px-2
              text-right
              text-(--text-main)
              outline-none
              placeholder:text-[0.6rem]
              placeholder:text-(--text-disabled)
              focus:border-(--border-default)
            "
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {iconesAutorisees.map((item) => {
          const Icone = item.composant;

          return (
            <CardAdministration
              key={item.titre}
              icone={
                <Icone
                  color1="currentColor"
                  height={25}
                  width={25}
                />
              }
              titre={item.titre}
              description={item.description}
              statut={item.statut ?? null}
              couleur={item.couleur}
              couleurFond={item.couleurFond}
              couleurBordure={item.couleurBordure}
              couleurStatut={
                item.couleurStatut ?? "var(--success)"
              }
              onClick={item.onClick}
            />
          );
        })}
      </div>

      {iconesAutorisees.length === 0 && (
        <p className="py-6 text-center text-(--text-disabled)">
          Aucun outil d’administration disponible.
        </p>
      )}
    </div>
  );
}
