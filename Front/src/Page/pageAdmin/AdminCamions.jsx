import { useCallback, useContext, useEffect, useState } from "react";

import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import PlaqueImmatriculation from "../../components/componentsIcone/ImmatPlaque.jsx";
import DriverIcone from "../../components/componentsIcone/DriverIcone.jsx";
import RippeurIcone from "../../components/componentsIcone/RippeurIcone.jsx";
import UserIcone from "../../components/componentsIcone/UserIcone.jsx";
import PlusIcone from "../../components/componentsIcone/PlusIcone.jsx";

import CocheIcone from "../../components/componentAdminCamion/CocheIcone.jsx";
import EclairIcone from "../../components/componentAdminCamion/EclairIcone.jsx";
import KmIcone from "../../components/componentAdminCamion/KmIcone.jsx";
import ModeleIcone from "../../components/componentAdminCamion/ModeleIcone.jsx";
import CalendrierIcone from "../../components/componentAdminCamion/CalendrierIcone.jsx";
import CarburantIcone from "../../components/componentAdminCamion/CarburantIcone.jsx";
import PoidsIcone from "../../components/componentAdminCamion/PoidsIcone.jsx";

import SelectCustom from "../../components/componentsCard/SelectCustom.jsx";

import { Location } from "../../components/componentsIcone/IconeStartEnd.jsx";

import truck from "../../assets/truck.png";
import camion from "/camion.png";

import apiFetch from "../../utils/apiFetch.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import { AgencesContext } from "../../contexte/agencesContext.jsx";
import Pulse from "../../components/Loading.jsx";

const postesEquipage = [
  { libelle: "Chauffeur", Icone: DriverIcone, props: { color: "currentColor" } },
  { libelle: "Ripeur", Icone: RippeurIcone, props: { color: "currentColor" } },
  { libelle: "Suppléant", Icone: UserIcone, props: { color1: "currentColor" } },
];

export default function AdminCamions() {
  const { user } = useContext(UserContext);
  const { listeAgences } = useContext(AgencesContext);
  const [openForm, setOpenForm] = useState(false);
  const [camionEnModificationId, setCamionEnModificationId] = useState(null);
  const [camions, setCamions] = useState([]);
  const [chargementCamions, setChargementCamions] = useState(false);
  const [menuCamionOuvertId, setMenuCamionOuvertId] = useState(null);
  const [agenceEditionCamionId, setAgenceEditionCamionId] = useState(null);
  const [camionEquipe, setCamionEquipe] = useState(null);
  const [salariesAgence, setSalariesAgence] = useState([]);
  const [equipage, setEquipage] = useState([]);
  const [chargementEquipage, setChargementEquipage] = useState(false);
  const [enregistrementEquipage, setEnregistrementEquipage] = useState(false);
  const [messageEquipage, setMessageEquipage] = useState("");

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
    agence_id: "",
  });

  const recupererCamions = useCallback(async () => {
    setChargementCamions(true);
    try {
      const res = await apiFetch("/administration/camions/recuperation");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Récupération impossible");
      setCamions(Array.isArray(data.donnees) ? data.donnees : []);
    } catch (e) {
      console.error("ERREUR RÉCUPÉRATION CAMIONS :", e);
      setCamions([]);
    } finally {
      setChargementCamions(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.permissions?.includes("CAMIONS_LIRE")) return;

    const chargement = window.setTimeout(() => recupererCamions(), 0);
    return () => window.clearTimeout(chargement);
  }, [user?.permissions, recupererCamions]);

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

  const correspondances = {
    Pret: "DISPONIBLE",
    Disponible: "DISPONIBLE",
    "En tournee": "EN_TOURNEE",
    "En tournée": "EN_TOURNEE",
    "En entretien": "EN_ENTRETIEN",
    Immobilisé: "IMMOBILISE",
    Immobilise: "IMMOBILISE",
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
    if (Number(formCamion.km) < 0 || !formCamion.agence_id) return;

    const statutBDD = correspondances[formCamion.statut];

    if (!statutBDD) {
      console.error("Statut inconnu :", formCamion.statut);
      return;
    }

    const endpoint = camionEnModificationId
      ? `/administration/camions/modification/${camionEnModificationId}`
      : "/creaCamion";
    const method = camionEnModificationId ? "PATCH" : "POST";
    const res = await apiFetch(endpoint, method, {
      body: JSON.stringify({
        ...formCamion,
        statut: statutBDD,
        energie: formCamion.energie.toUpperCase(),
      }),
    });

    if (!res.ok) {
      const erreur = await res.json();
      console.error("ERREUR ENREGISTREMENT CAMION :", erreur);
      return;
    }

    await res.json();
    await recupererCamions();
    setOpenForm(false);
    setCamionEnModificationId(null);
  };

  const ouvrirCreation = () => {
    setCamionEnModificationId(null);
    setFormCamion((ancien) => ({
      ...ancien,
      immatriculation: "",
      km: 0,
      agence_id: "",
      dateReleve: inputDate,
    }));
    setOpenForm(true);
  };

  const ouvrirModification = (camionAModifier) => {
    const statutAffiche = {
      DISPONIBLE: "Disponible",
      EN_TOURNEE: "En tournee",
      EN_ENTRETIEN: "En entretien",
      IMMOBILISE: "Immobilise",
      HORS_SERVICE: "Hors service",
    }[camionAModifier.statut] || "Disponible";

    setCamionEnModificationId(camionAModifier.id);
    setFormCamion((ancien) => ({
      ...ancien,
      immatriculation: camionAModifier.immatriculation,
      statut: statutAffiche,
      energie: `${camionAModifier.energie.charAt(0)}${camionAModifier.energie.slice(1).toLowerCase()}`,
      agence: camionAModifier.agence_nom || "",
      agence_id: camionAModifier.agence_id,
      km: camionAModifier.kilometrage,
      marque: camionAModifier.marque,
      modele: camionAModifier.modele,
    }));
    setOpenForm(true);
  };

  const supprimerUnCamion = async (camionASupprimer) => {
    if (!window.confirm(`Supprimer le camion ${camionASupprimer.immatriculation} ?`)) return;
    try {
      const res = await apiFetch(
        `/administration/camions/suppression/${camionASupprimer.id}`,
        "DELETE",
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Suppression impossible");
      setCamions((actuels) => actuels.filter((camionActuel) => camionActuel.id !== camionASupprimer.id));
    } catch (e) {
      console.error("ERREUR SUPPRESSION CAMION :", e);
    }
  };

  const changerAgenceCamion = async (camionId, agenceId) => {
    try {
      const res = await apiFetch(`/administration/camions/${camionId}/agence`, "PUT", {
        body: JSON.stringify({ agence_id: Number(agenceId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Affectation impossible");
      setAgenceEditionCamionId(null);
      await recupererCamions();
    } catch (e) {
      console.error("ERREUR AFFECTATION CAMION :", e);
    }
  };

  const ouvrirEquipage = async (camionActuel) => {
    setCamionEquipe(camionActuel);
    setChargementEquipage(true);
    setMessageEquipage("");
    try {
      const res = await apiFetch(`/administration/livreurs/organisation?agence_id=${camionActuel.agence_id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Chargement impossible");
      const camionOrganisation = data.donnees.camions.find((item) => Number(item.id) === Number(camionActuel.id));
      setSalariesAgence(data.donnees.livreurs || []);
      setEquipage(camionOrganisation?.equipage?.map((salarie) => salarie.id) || []);
    } catch (error) {
      setMessageEquipage(error.message);
    } finally {
      setChargementEquipage(false);
    }
  };

  const modifierEquipage = (position, valeur) => {
    const salarieId = valeur ? Number(valeur) : null;
    setEquipage((actuel) => {
      const suivant = [...actuel];
      if (!salarieId) return suivant.slice(0, position);
      suivant[position] = salarieId;
      return suivant;
    });
  };

  const enregistrerEquipage = async () => {
    setEnregistrementEquipage(true);
    setMessageEquipage("");
    try {
      const res = await apiFetch(`/administration/livreurs/camions/${camionEquipe.id}/equipage`, "PUT", {
        body: JSON.stringify({ user_ids: equipage.filter(Boolean) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Enregistrement impossible");
      setMessageEquipage("Équipage enregistré.");
    } catch (error) {
      setMessageEquipage(error.message);
    } finally {
      setEnregistrementEquipage(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center p-4 overflow-y-auto overflow-x-hidden pb-50">
      {!openForm && (
        <div className="flex w-full flex-col items-center gap-3">
          <h1 className="text-xl">Mes camions</h1>
          {chargementCamions ? (
            <Pulse className="py-10" />
          ) : camions.length === 0 ? (
            <p className="py-8 text-sm text-white/60">Aucun camion enregistré.</p>
          ) : (
            <div className="grid w-full gap-3 sm:grid-cols-2">
            {camions.map((camionActuel) => (
              <article key={camionActuel.id} className="relative flex min-h-44 w-full overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#132139] to-[#091425] p-3 shadow-lg shadow-black/10">
                {(user?.permissions?.includes("CAMIONS_MODIFIER") ||
                  user?.permissions?.includes("CAMIONS_SUPPRIMER")) && (
                  <div className="absolute right-2 top-2 z-20">
                    <button
                      type="button"
                      aria-label={`Actions pour ${camionActuel.immatriculation}`}
                      onClick={() =>
                        setMenuCamionOuvertId((idActuel) =>
                          idActuel === camionActuel.id ? null : camionActuel.id,
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none hover:bg-white/10"
                    >
                      ⋮
                    </button>

                    {menuCamionOuvertId === camionActuel.id && (
                      <div className="absolute right-0 top-9 z-30 min-w-32 overflow-hidden rounded-xl border border-white/15 bg-[#081222] py-1 text-xs shadow-xl">
                        {user?.permissions?.includes("CAMIONS_MODIFIER") && (
                          <button
                            type="button"
                            onClick={() => {
                              setMenuCamionOuvertId(null);
                              ouvrirModification(camionActuel);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-white/10"
                          >
                            Modifier
                          </button>
                        )}
                        {user?.permissions?.includes("CAMIONS_SUPPRIMER") && (
                          <button
                            type="button"
                            onClick={() => {
                              setMenuCamionOuvertId(null);
                              supprimerUnCamion(camionActuel);
                            }}
                            className="w-full px-3 py-2 text-left text-red-300 hover:bg-white/10"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex w-1/3 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/3">
                  <img src={truck} alt="Camion" className="h-auto w-full scale-[1.35] object-contain" />
                </div>
                <div className="flex w-2/3 flex-col justify-center gap-2 px-3 py-2 pr-9">
                  <div className="flex justify-end">
                    <span className="rounded-full border border-white/10 bg-green-500/10 px-2 py-1 text-[0.6rem] text-green-300">
                      {camionActuel.statut}
                    </span>
                  </div>
                  <PlaqueImmatriculation
                    className="h-12 w-full"
                    immatriculation={camionActuel.immatriculation}
                  />
                  <p className="text-xs">{camionActuel.marque} {camionActuel.modele}</p>
                  {agenceEditionCamionId === camionActuel.id ? (
                    <select
                      autoFocus
                      defaultValue={camionActuel.agence_id}
                      onChange={(e) => changerAgenceCamion(camionActuel.id, e.target.value)}
                      onBlur={() => setAgenceEditionCamionId(null)}
                      className="rounded-lg bg-[#081222] px-2 py-1 text-xs"
                    >
                      {listeAgences.map((agence) => <option key={agence.id} value={agence.id}>{agence.nom}</option>)}
                    </select>
                  ) : (
                    <button
                      type="button"
                      disabled={!user?.permissions?.includes("CAMIONS_MODIFIER")}
                      onClick={() => setAgenceEditionCamionId(camionActuel.id)}
                      className="flex items-center gap-1 text-left text-xs text-white/60 disabled:cursor-default"
                    >
                      <Location className="size-4" /> {camionActuel.agence_nom || "Agence inconnue"}
                    </button>
                  )}
                  {user?.permissions?.includes("CAMIONS_AFFECTER_EQUIPAGE") && (
                    <button type="button" onClick={() => ouvrirEquipage(camionActuel)} className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-yellow-300/20 bg-yellow-300/5 px-3 py-2 text-xs text-yellow-100">
                      <DriverIcone width={15} height={15} /> Gérer l’équipage
                    </button>
                  )}
                </div>
              </article>
            ))}
            </div>
          )}
        </div>
      )}

      {camionEquipe && <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center" onMouseDown={(e) => e.target === e.currentTarget && setCamionEquipe(null)}>
        <section className="w-full rounded-t-3xl border border-white/12 bg-[#081426] p-5 shadow-2xl sm:max-w-2xl sm:rounded-3xl">
          <div className="mb-5 flex items-start justify-between"><div><p className="text-[0.6rem] uppercase tracking-[0.16em] text-yellow-200/60">Équipage du camion</p><h2 className="text-lg font-semibold">{camionEquipe.immatriculation}</h2><p className="text-xs text-white/40">{camionEquipe.agence_nom} · 3 places maximum</p></div><button type="button" onClick={() => setCamionEquipe(null)} className="flex size-9 items-center justify-center rounded-full border border-white/10 text-lg">×</button></div>
          {chargementEquipage ? <Pulse className="py-12" /> : salariesAgence.length === 0 ? <div className="rounded-2xl border border-dashed border-white/12 py-10 text-center text-sm text-white/50">Aucun salarié affilié à cette agence.</div> : <div className="grid gap-3 sm:grid-cols-3">{postesEquipage.map(({ libelle, Icone, props }, position) => <label key={libelle} className="rounded-2xl border border-white/8 bg-white/3 p-3 text-xs text-white/55"><span className="mb-2 flex items-center gap-2 text-white/80"><Icone width={19} height={19} {...props} />{libelle}</span><select value={equipage[position] || ""} disabled={position > 0 && !equipage[position - 1]} onChange={(e) => modifierEquipage(position, e.target.value)} className="w-full rounded-xl border border-white/12 bg-[#0b192d] px-2 py-3 text-xs text-white disabled:opacity-40"><option value="">Non affecté</option>{salariesAgence.map((salarie) => <option key={salarie.id} value={salarie.id} disabled={equipage.some((id, index) => index !== position && id === salarie.id)}>{salarie.prenom} {salarie.nom}</option>)}</select></label>)}</div>}
          {messageEquipage && <p className="mt-3 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/65">{messageEquipage}</p>}
          {!chargementEquipage && salariesAgence.length > 0 && <div className="mt-5 flex justify-end"><button type="button" disabled={enregistrementEquipage} onClick={enregistrerEquipage} className="rounded-xl bg-(--yellow-zesteo) px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50">{enregistrementEquipage ? "Enregistrement…" : "Enregistrer l’équipage"}</button></div>}
        </section>
      </div>}

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center w-full"
      >
        {!openForm && user?.permissions?.includes("CAMIONS_CREER") && (
          <button
            type="button"
            onClick={ouvrirCreation}
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
                  {camionEnModificationId ? "Modifier" : "Créer"}
                  <br />
                  <span className="text-yellow-300">le camion</span>
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
                <label className="col-span-2 flex flex-col gap-1">
                  <span className="text-white/60">Agence</span>
                  <select
                    required
                    value={formCamion.agence_id}
                    onChange={(e) => {
                      const agenceId = Number(e.target.value);
                      const agence = listeAgences.find((item) => item.id === agenceId);
                      setFormCamion((ancienFormulaire) => ({
                        ...ancienFormulaire,
                        agence_id: agenceId,
                        agence: agence?.nom || "",
                      }));
                    }}
                    className="rounded-lg border border-white/15 bg-[#081222] px-2 py-2 outline-none"
                  >
                    <option value="">Choisir une agence</option>
                    {listeAgences.map((agence) => (
                      <option key={agence.id} value={agence.id}>{agence.nom}</option>
                    ))}
                  </select>
                </label>
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
              <DriverIcone className="size-4" />
              {camionEnModificationId ? "Enregistrer les modifications" : "Créer le camion"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenForm(false);
                setCamionEnModificationId(null);
              }}
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
