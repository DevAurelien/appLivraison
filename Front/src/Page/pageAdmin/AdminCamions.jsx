import React, { useContext, useState } from "react";

import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import PlaqueImmatriculation from "../../components/componentsIcone/ImmatPlaque.jsx";
import DriverIcone from "../../components/componentsIcone/DriverIcone.jsx";
import RippeurIcone from "../../components/componentsIcone/RippeurIcone.jsx";
import PlusIcone from "../../components/componentsIcone/PlusIcone.jsx";

import CocheIcone from "../../components/componentAdminCamion/CocheIcone.jsx";
import EclairIcone from "../../components/componentAdminCamion/EclairIcone.jsx";
import KmIcone from "../../components/componentAdminCamion/KmIcone.jsx";
import ModeleIcone from "../../components/componentAdminCamion/ModeleIcone.jsx";
import CalendrierIcone from "../../components/componentAdminCamion/CalendrierIcone.jsx";
import CarburantIcone from "../../components/componentAdminCamion/CarburantIcone.jsx";
import PoidsIcone from "../../components/componentAdminCamion/PoidsIcone.jsx";

import StatutCard from "../../components/componentsCard/StatutCard.jsx";
import SelectCustom from "../../components/componentsCard/SelectCustom.jsx";

import { Location } from "../../components/componentsIcone/IconeStartEnd.jsx";

import truck from "../../assets/truck.png";
import camion from "/camion.png";
import { MenuContext } from "../../contexte/menuContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import { UserContext } from "../../contexte/userContext.jsx";

export default function AdminCamions() {
  const [openForm, setOpenForm] = useState(false);
  const { setPage } = useContext(MenuContext);
  const { user } = useContext(UserContext);

  const date = new Date();
  const an = String(date.getFullYear());
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const jo = String(date.getDate()).padStart(2, "0");
  const inputDate = `${an}-${mo}-${jo}`;

  const [formCamion, setFormCamion] = useState({
    immatriculation: "",
    statut: "Disponible",
    energie: "Diesel",
    agence: "Toulouse, 31",
    km: "0",
    marque: "Renault",
    modele: "Master",
    annee: 2023,
    poids: 3500,
    dateReleve: inputDate,
  });

  const vehicules = {
    Renault: ["Master", "Trafic", "Kangoo"],
    Peugeot: ["Boxer", "Expert", "Partner"],
    Mercedes: ["Sprinter", "Vito", "Citan"],
    Iveco: ["Daily"],
    Ford: ["Transit", "Transit Custom"],
  };

  const carburants = ["Essence", "Diesel", "Electrique"];
  const statutCamion = [
    "Disponible",
    "En tournee",
    "En entretien",
    "Immobilise",
    "Hors service",
  ];

  const marques = Object.keys(vehicules);

  const modeles = vehicules[formCamion.marque] || [];

  const années = [2023, 2024, 2025, 2026, 2027, 2028, 2029];

  const salaries = [{ driver: "Theo" }, { rippeur: "Gaetan" }];
 const correspondances = {
  Pret: "DISPONIBLE",
  Disponible: "DISPONIBLE",
  "En tournée": "EN_TOURNEE",
  "En entretien": "EN_ENTRETIEN",
  Immobilisé: "IMMOBILISE",
  "Hors service": "HORS_SERVICE",
};

  const handleImmat = (e) => {
    const raw = e.target.value.toUpperCase().replace(/-/g, "");

    let lettres1 = raw.slice(0, 2).replace(/[^A-Z]/g, "");

    let chiffres = raw.slice(2, 5).replace(/[^0-9]/g, "");

    let lettres2 = raw.slice(5, 7).replace(/[^A-Z]/g, "");

    let value = lettres1;

    if (lettres1.length === 2 && raw.length > 2) {
      value += `-${chiffres}`;
    }

    if (chiffres.length === 3 && raw.length > 5) {
      value += `-${lettres2}`;
    }

    setFormCamion((ancienFormulaire) => ({
      ...ancienFormulaire,
      immatriculation: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formCamion.immatriculation.length < 9) return;
  if (Number(formCamion.km) <= 0) return;

  const statutBDD = correspondances[formCamion.statut];

  if (!statutBDD) {
    console.error("Statut inconnu :", formCamion.statut);
    return;
  }

  const res = await apiFetch("/creaCamion", "POST", {
    body: JSON.stringify({
      ...formCamion,
      statut: statutBDD,
      energie: formCamion.energie.toUpperCase(),
    }),
  });

  if (!res.ok) return;

  const data = await res.json();
  console.log(data);
};

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center p-4 overflow-y-auto overflow-x-hidden pb-50">
      {!openForm && (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-xl">Mes camions</h1>

          <div className="w-full flex size-fit rounded-2xl card">
            <div className="w-2/5 relative pt-4">
              <div className="card2 absolute m-2 px-1 rounded-md top-0 left-0">
                <h1 className="text-(--yellow-zesteo) text-[0.6rem] border-(--yellow-zesteo-border)">
                  Equipe 1
                </h1>
              </div>

              <img src={truck} alt="Camion" className="scale-[1.5]" />
            </div>

            <div className="h-full flex flex-col w-3/5 px-4 p-2">
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

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center w-full"
      >
        {!openForm && user?.permissions?.includes("CAMIONS_CREER") && (
          <button
            type="button"
            onClick={() => setOpenForm(true)}
            className="
              z-5
              flex
              w-4/5
              gap-2
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              bg-yellow-300
              px-4
              py-2
              text-black
              disabled:cursor-not-allowed
            "
          >
            <PlusIcone className="size-6 p-1" color1="black" />
            Ajouter un camion
          </button>
        )}

        {openForm && (
          <div className="flex flex-col w-full h-full gap-2">
            {/* ============================== */}
            {/* PREVISUALISATION DU CAMION */}
            {/* ============================== */}

            <div className="bgCreaCamion relative rounded-xl aspect-video p-2 flex w-full overflow-visible">
              {/* TITRE */}

              <div
                className="
                  absolute
                  left-2
                  top-3
                  z-8
                  px-3
                  py-2
                  rounded-lg
                  bg-black/45
                  backdrop-blur-md
                  border-white/15
                  shadow-lg
                  border
                "
              >
                <h1 className="font-bold leading-none drop-shadow-md">
                  Créer
                  <br />
                  <span className="text-yellow-300">un camion</span>
                </h1>
              </div>

              {/* IMAGE CAMION */}

              <img
                src={camion}
                alt="Camion"
                className="
                  scale-[1.2]
                  absolute
                  right-[8%]
                  top-[-36%]
                  w-[85%]
                  h-auto
                  object-contain
                  max-w-none
                  z-10
                "
              />

              {/* PLAQUE IMMATRICULATION */}

              <input
                type="text"
                value={formCamion.immatriculation}
                onChange={handleImmat}
                maxLength={9}
                className="
                  absolute
                  left-[18%]
                  top-[51%]
                  w-[15%]
                  h-4
                  rotate-2
                  text-black
                  text-center
                  font-bold
                  text-[0.6rem]
                  cursor-text
                  rounded
                  outline-none
                  z-20
                "
                required
              />

              {/* INFORMATIONS RAPIDES */}

              <div className="absolute bottom-0 left-0 h-25 bg-transparent flex justify-evenly w-full z-20">
                <h1 className="bg-linear-to-t from-transparent/70 to-black/30 w-full flex justify-center items-start text-[0.6rem]">
                  Cliquez sur la plaque pour modifier l'immatriculation
                </h1>

                <div className="card absolute bottom-0 left-0 rounded-b-xl h-20 flex items-center justify-around w-full z-20 text-[0.6rem]">
                  {/* STATUT */}

                  <div className="flex flex-col justify-center items-end border-r border-white/20 p-4">
                    <div className="flex text-white/50 gap-1">
                      <CocheIcone
                        className="size-4"
                        color1="var(--yellow-zesteo)"
                      />
                      Statut
                    </div>

                    {formCamion.statut}
                  </div>

                  {/* ENERGIE */}

                  <div className="flex flex-col justify-center items-end border-r border-white/20 p-4">
                    <div className="flex text-white/50 gap-1">
                      <EclairIcone
                        className="size-4"
                        color1="var(--yellow-zesteo)"
                      />
                      Energie
                    </div>

                    {formCamion.energie}
                  </div>

                  {/* AGENCE */}

                  <div className="flex flex-col justify-center items-end border-r border-white/20 gap-1 p-4 whitespace-nowrap">
                    <div className="flex text-white/50 gap-1">
                      <Location
                        className="size-4"
                        color1="var(--yellow-zesteo)"
                      />
                      Agence
                    </div>

                    {formCamion.agence}
                  </div>

                  {/* KILOMETRAGE */}

                  <div className="flex flex-col justify-center items-end p-4">
                    <div className="flex text-white/50 gap-1">
                      <KmIcone
                        className="size-4"
                        color1="var(--yellow-zesteo)"
                      />
                      Kilométrage
                    </div>
                    {formCamion.km} km
                  </div>
                </div>
              </div>
            </div>

            {/* ============================== */}
            {/* INFORMATIONS DU CAMION */}
            {/* ============================== */}

            <div className="card rounded-xl flex justify-center flex-col text-[0.8rem] p-2 gap-2">
              <h1>Informations du camion</h1>

              <div className="grid grid-cols-2 gap-2">
                {/* MARQUE */}

                <SelectCustom
                  label="Marque"
                  liste={marques}
                  value={formCamion.marque}
                  onChange={(nouvelleMarque) => {
                    setFormCamion((ancienFormulaire) => ({
                      ...ancienFormulaire,
                      marque: nouvelleMarque,
                      modele: "",
                    }));
                  }}
                  Icone={CamionIcone}
                  required
                />

                {/* MODELE */}

                <SelectCustom
                  label="Modèle"
                  liste={modeles}
                  value={formCamion.modele}
                  onChange={(nouveauModele) =>
                    setFormCamion((ancienFormulaire) => ({
                      ...ancienFormulaire,
                      modele: nouveauModele,
                    }))
                  }
                  Icone={ModeleIcone}
                  placeholder="Modèle"
                  disabled={!formCamion.marque}
                  required
                />

                <SelectCustom
                  label="Année"
                  liste={années}
                  onChange={(nouvelleAnnee) =>
                    setFormCamion((ancienFormulaire) => ({
                      ...ancienFormulaire,
                      annee: nouvelleAnnee,
                    }))
                  }
                  value={formCamion.annee}
                  Icone={CalendrierIcone}
                  disabled={!formCamion.annee}
                  required
                />
                <SelectCustom
                  label="PTAC (kg)"
                  onChange={(nouveauPoids) =>
                    setFormCamion((ancienFormulaire) => ({
                      ...ancienFormulaire,
                      poids: nouveauPoids,
                    }))
                  }
                  value={formCamion.poids}
                  Icone={PoidsIcone}
                  disabled={!formCamion.poids}
                  required
                />
                <SelectCustom
                  label="Energie"
                  liste={carburants}
                  onChange={(nouvelleEnergie) =>
                    setFormCamion((ancienFormulaire) => ({
                      ...ancienFormulaire,
                      energie: nouvelleEnergie,
                    }))
                  }
                  value={formCamion.energie}
                  Icone={CarburantIcone}
                  disabled={!formCamion.energie}
                  required
                />
                <SelectCustom
                  label="Statut"
                  liste={statutCamion}
                  onChange={(nouveauStatut) =>
                    setFormCamion((ancienFormulaire) => ({
                      ...ancienFormulaire,
                      statut: nouveauStatut,
                    }))
                  }
                  value={formCamion.statut}
                  Icone={CocheIcone}
                  disabled={!formCamion.statut}
                  required
                />
              </div>
            </div>

            <div className="card rounded-xl p-2 flex flex-col">
              <h1 className="text-[0.8rem] whitespace-nowrap">
                Déclaration kilométrique initiale
              </h1>
              <div className="flex w-full gap-2">
                <div className="flex flex-col w-1/2">
                  <label
                    htmlFor="number"
                    className="text-[0.5rem] text-white/50 p-1"
                  >
                    Kilométrage actuel
                  </label>
                  <div className="flex w-full border border-(--yellow-zesteo) rounded-md">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      name="number"
                      value={formCamion.km}
                      onChange={(e) => {
                        const nouveauKm = e.target.value.replace(/\D/g, "");

                        setFormCamion((ancienFormulaire) => ({
                          ...ancienFormulaire,
                          km: Number(nouveauKm),
                        }));
                      }}
                      className="outline-none w-7/8 px-1 text-[0.8rem] text-right"
                    />
                    <p className="flex w-1/8 justify-center items-center text-[0.6rem]">
                      km
                    </p>
                  </div>
                </div>

                <div className="flex flex-col w-1/2 justify-end">
                  <label
                    htmlFor="date"
                    className="text-[0.5rem] text-white/50 p-1"
                  >
                    Date du relevé
                  </label>
                  <input
                    name="date"
                    type="date"
                    className="border w-full rounded-md px-1 text-[0.8rem] border-(--yellow-zesteo)"
                    value={formCamion.dateReleve}
                    onChange={(e) =>
                      setFormCamion((ancienFormulaire) => ({
                        ...ancienFormulaire,
                        dateReleve: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {openForm && (
          <div className="flex w-full gap-2 text-[0.8rem] mt-2">
            <button
              type="submit"
              className="hover:scale-[1.02] flex justify-center items-center w-3/5 h-10 bg-(--yellow-zesteo) text-black rounded-xl gap-2 cursor-pointer"
            >
              <DriverIcone className="size-4" /> Creer le camion
            </button>

            <button
              type="button"
              onClick={() => setPage("Administration")}
              className="flex justify-center items-center w-2/5 h-10 card rounded-xl cursor-pointer"
            >
              Annuler
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
