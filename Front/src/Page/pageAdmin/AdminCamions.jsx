import React, { useState } from "react";

import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import PlaqueImmatriculation from "../../components/componentsIcone/ImmatPlaque.jsx";
import DriverIcone from "../../components/componentsIcone/DriverIcone.jsx";
import RippeurIcone from "../../components/componentsIcone/RippeurIcone.jsx";
import PlusIcone from "../../components/componentsIcone/PlusIcone.jsx";

import CocheIcone from "../../components/componentAdminCamion/CocheIcone.jsx";
import EclairIcone from "../../components/componentAdminCamion/EclairIcone.jsx";
import KmIcone from "../../components/componentAdminCamion/KmIcone.jsx";
import ModeleIcone from "../../components/componentAdminCamion/ModeleIcone.jsx";
import CalendrierIcone from "../../components/componentAdminCamion/CalendrierIcone.jsx"
import CarburantIcone from "../../components/componentAdminCamion/CarburantIcone.jsx"
import PoidsIcone from "../../components/componentAdminCamion/PoidsIcone.jsx"

import StatutCard from "../../components/componentsCard/StatutCard.jsx";
import SelectCustom from "../../components/componentsCard/SelectCustom.jsx";

import { Location } from "../../components/componentsIcone/IconeStartEnd.jsx";

import truck from "../../assets/truck.png";
import camion from "/camion.png";

export default function AdminCamions() {
  const [openForm, setOpenForm] = useState(false);

  const [immatriculation, setImmatriculation] = useState("");

  const [statut, setStatut] = useState("Pret");
  const [energie, setEnergie] = useState("Diesel");
  const [agence, setAgence] = useState("Toulouse, 31");
  const [km, setKm] = useState(123340);

  const [marque, setMarque] = useState("Renault");
  const [modele, setModele] = useState("");
  const [annee, setAnnee] = useState(2023);
  const [poids, setPoids] = useState(3500);

  const vehicules = {
    Renault: ["Master", "Trafic", "Kangoo"],
    Peugeot: ["Boxer", "Expert", "Partner"],
    Mercedes: ["Sprinter", "Vito", "Citan"],
    Iveco: ["Daily"],
    Ford: ["Transit", "Transit Custom"],
  };

  const carburants = ["Essence", "Diesel", "Electrique", "GPL"];

  const marques = Object.keys(vehicules);

  const modeles = vehicules[marque] || [];

  const années = [2023,2024,2025,2026,2027,2028,2029];

  const salaries = [
    { driver: "Theo" },
    { rippeur: "Gaetan" },
  ];

  const handleImmat = (e) => {
    const raw = e.target.value
      .toUpperCase()
      .replace(/-/g, "");

    let lettres1 = raw
      .slice(0, 2)
      .replace(/[^A-Z]/g, "");

    let chiffres = raw
      .slice(2, 5)
      .replace(/[^0-9]/g, "");

    let lettres2 = raw
      .slice(5, 7)
      .replace(/[^A-Z]/g, "");

    let value = lettres1;

    if (lettres1.length === 2 && raw.length > 2) {
      value += `-${chiffres}`;
    }

    if (chiffres.length === 3 && raw.length > 5) {
      value += `-${lettres2}`;
    }

    setImmatriculation(value);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center p-4 overflow-y-auto overflow-x-hidden pb-50">

      {!openForm && (
        <div className="flex flex-col items-center gap-2">

          <h1 className="text-xl">
            Mes camions
          </h1>

          <div className="w-full flex size-fit rounded-2xl card">

            <div className="w-2/5 relative pt-4">

              <div className="card2 absolute m-2 px-1 rounded-md top-0 left-0">
                <h1 className="text-(--yellow-zesteo) text-[0.6rem] border-(--yellow-zesteo-border)">
                  Equipe 1
                </h1>
              </div>

              <img
                src={truck}
                alt="Camion"
                className="scale-[1.5]"
              />

            </div>

            <div className="h-full flex flex-col w-3/5 px-4 p-2">

              <StatutCard
                couleurFond="var(--success)"
                statut="Pret"
              />

              <PlaqueImmatriculation
                className="w-full h-4/5"
                immatriculation="GK-822-PX"
              />

              <div className="flex gap-2 text-[0.8rem] py-1 border-b border-(--border-default)">

                {salaries.map((sal, index) => (
                  <p
                    className="flex gap-2"
                    key={index}
                  >

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

                <h1 className="text-[0.8rem]">
                  Toulouse, 31
                </h1>

              </div>

            </div>

          </div>

        </div>
      )}

      <form className="relative flex justify-center w-full">

        {!openForm && (
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

            <PlusIcone
              className="size-6 p-1"
              color1="black"
            />

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

                  <span className="text-yellow-300">
                    un camion
                  </span>
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
                value={immatriculation}
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

                    {statut}

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

                    {energie}

                  </div>

                  {/* AGENCE */}

                  <div className="flex flex-col justify-center items-end border-r border-white/20 gap-1 p-4">

                    <div className="flex text-white/50 gap-1">

                      <Location
                        className="size-4"
                        color1="var(--yellow-zesteo)"
                      />

                      Agence

                    </div>

                    {agence}

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

                    {km} km

                  </div>

                </div>

              </div>

            </div>

            {/* ============================== */}
            {/* INFORMATIONS DU CAMION */}
            {/* ============================== */}

            <div className="card rounded-xl flex justify-center flex-col text-[0.8rem] p-2 gap-2">

              <h1>
                Informations du camion
              </h1>

              <div className="grid grid-cols-2 gap-2">

                {/* MARQUE */}

                <SelectCustom
                  label="Marque"
                  liste={marques}
                  value={marque}
                  onChange={(nouvelleMarque) => {
                    setMarque(nouvelleMarque);

                 
                    setModele("");
                  }}
                  Icone={CamionIcone}
                  required
                />

                {/* MODELE */}

                <SelectCustom
                  label="Modèle"
                  liste={modeles}
                  value={modele}
                  onChange={setModele}
                  Icone={ModeleIcone}
                  placeholder="Modèle"
                  disabled={!marque}
                  required
                />

                <SelectCustom 
                label="Année"
                liste={années}
                onChange={setAnnee}
                value={annee}
                Icone={CalendrierIcone}
                disabled={!annee}
                required
                />
                <SelectCustom 
                label="PTAC (kg)"
                onChange={setPoids}
                value={poids}
                Icone={PoidsIcone}
                disabled={!poids}
                required
                />
                <SelectCustom 
                label="Energie"
                liste={carburants}
                onChange={setEnergie}
                value={energie}
                Icone={CarburantIcone}
                disabled={!energie}
                required
                />

              </div>

            </div>
            

          </div>
        )}
        
      </form>
{openForm && <div className="flex w-full gap-2 text-[0.8rem]"><div className="hover:scale-[1.02] flex justify-center items-center w-3/5 h-10 bg-(--yellow-zesteo) text-black rounded-xl gap-2 cursor-pointer"><DriverIcone className="size-4"/> Creer le camion</div><div className="flex justify-center items-center w-2/5 h-10 card rounded-xl cursor-pointer">Annuler</div>
   </div> }
   </div>
  );
}