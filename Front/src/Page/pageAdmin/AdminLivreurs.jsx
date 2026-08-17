import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import Pulse from "../../components/Loading.jsx";
import { AgencesContext } from "../../contexte/agencesContext.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";

const heure = (valeur) => valeur ? new Date(valeur).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—";
const duree = (minutes) => {
  if (minutes === null || minutes === undefined) return "Journée en cours";
  const total = Math.max(0, Number(minutes));
  return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, "0")}`;
};

const Horaire = ({ libelle, valeur }) => (
  <span className="min-w-0"><small className="block truncate text-[0.55rem] uppercase tracking-wide text-white/35">{libelle}</small><strong className="block text-xs text-white/85">{valeur}</strong></span>
);

export default function AdminLivreurs() {
  const { user } = useContext(UserContext);
  const { listeAgences } = useContext(AgencesContext);
  const [livreurs, setLivreurs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [affiliationEnCours, setAffiliationEnCours] = useState(null);
  const [message, setMessage] = useState({ type: "", texte: "" });
  const [messageMasque, setMessageMasque] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState("");
  const [filtreAgence, setFiltreAgence] = useState("");
  const [filtreOuvert, setFiltreOuvert] = useState(false);
  const peutAffilier = user?.permissions?.includes("AGENCES_AFFECTER_SALARIE");
  const agencesDisponibles = user?.role_code === "CHEF_AGENCE"
    ? listeAgences.filter((agence) => Number(agence.id) === Number(user.agence_id))
    : listeAgences;
  const rolesDisponibles = roles.map((role) => [role.code, role.libelle]);
  const livreursFiltres = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    return livreurs.filter((livreur) => {
      const correspondRecherche = !terme || [livreur.prenom, livreur.nom, livreur.email]
        .filter(Boolean)
        .some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme));
      const correspondRole = !filtreRole || livreur.role_code === filtreRole;
      const correspondAgence = !filtreAgence
        || (filtreAgence === "sans_agence" ? !livreur.agence_id : Number(livreur.agence_id) === Number(filtreAgence));
      return correspondRecherche && correspondRole && correspondAgence;
    });
  }, [filtreAgence, filtreRole, livreurs, recherche]);

  const chargerLivreurs = useCallback(async () => {
    setChargement(true);
    try {
      const [resSalaries, resRoles] = await Promise.all([
        apiFetch("/administration/livreurs/tous"),
        apiFetch("/administration/livreurs/roles"),
      ]);
      const [dataSalaries, dataRoles] = await Promise.all([resSalaries.json(), resRoles.json()]);
      if (!resSalaries.ok) throw new Error(dataSalaries.message || "Chargement impossible");
      if (!resRoles.ok) throw new Error(dataRoles.message || "Chargement des rôles impossible");
      setLivreurs(dataSalaries.donnees || []);
      setRoles(dataRoles.donnees || []);
    } catch (e) {
      setMessage({ type: "erreur", texte: e.message });
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    const appel = window.setTimeout(() => chargerLivreurs(), 0);
    return () => window.clearTimeout(appel);
  }, [chargerLivreurs]);

  useEffect(() => {
    if (message.type !== "succes" || !message.texte) return;
    const disparition = window.setTimeout(() => setMessageMasque(true), 3000);
    const suppression = window.setTimeout(() => setMessage({ type: "", texte: "" }), 3500);
    return () => {
      window.clearTimeout(disparition);
      window.clearTimeout(suppression);
    };
  }, [message]);

  const affilier = async (livreur, nouvelleAgenceId) => {
    if (!nouvelleAgenceId || Number(nouvelleAgenceId) === Number(livreur.agence_id)) return;
    setAffiliationEnCours(livreur.id);
    try {
      const res = await apiFetch("/administration/livreurs/affiliation", "PUT", {
        body: JSON.stringify({ user_id: livreur.id, agence_id: Number(nouvelleAgenceId) }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage({ type: "erreur", texte: data.message });
      setMessageMasque(false);
      setMessage({ type: "succes", texte: `${livreur.prenom} ${livreur.nom} a été affilié.` });
      await chargerLivreurs();
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    } finally {
      setAffiliationEnCours(null);
    }
  };

  const changerFiltre = (valeur) => {
    setFiltreRole(valeur.startsWith("role:") ? valeur.slice(5) : "");
    setFiltreAgence(valeur.startsWith("agence:") ? valeur.slice(7) : "");
    setFiltreOuvert(false);
  };
  const libelleFiltre = filtreRole
    ? rolesDisponibles.find(([code]) => code === filtreRole)?.[1] || "Rôle"
    : filtreAgence === "sans_agence"
      ? "Sans agence"
      : agencesDisponibles.find((agence) => Number(agence.id) === Number(filtreAgence))?.nom || "Tous les salariés";

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-5 overflow-y-auto px-4 pb-44">
      <header className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-yellow-200/70">Équipe du jour</p><h1 className="mt-1 text-2xl font-semibold">Mes livreurs</h1><p className="text-xs text-white/45">Horaires, pauses et temps travaillé</p></div>
      </header>
      {message.texte && <p className={`rounded-xl border px-3 py-2 text-sm transition-all duration-500 ${messageMasque ? "translate-y-1 opacity-0" : "opacity-100"} ${message.type === "erreur" ? "text-red-300" : "text-green-300"}`}>{message.texte}</p>}

      <div className="flex w-full items-center gap-2">
        <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Nom, prénom ou email…" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#081426] px-3 py-2.5 text-xs outline-none focus:border-yellow-300/40" />
        <div className="relative w-36 shrink-0 sm:w-44">
          <button type="button" onClick={() => setFiltreOuvert((ouvert) => !ouvert)} aria-expanded={filtreOuvert} className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#081426] px-3 py-2.5 text-left text-xs text-white"><span className="truncate">{libelleFiltre}</span><span className={`shrink-0 text-white/45 transition-transform ${filtreOuvert ? "rotate-180" : ""}`}>⌄</span></button>
          {filtreOuvert && <div className="absolute top-full right-0 z-40 mt-2 max-h-80 w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/12 bg-[#081426] p-2 shadow-2xl shadow-black/40">
            <button type="button" onClick={() => changerFiltre("")} className={`w-full rounded-lg px-3 py-2 text-left text-xs ${!filtreRole && !filtreAgence ? "bg-yellow-300/10 text-yellow-100" : "text-white/65 hover:bg-white/6"}`}>Tous les salariés</button>
            <p className="px-3 pb-1 pt-3 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/30">Rôles</p>
            {rolesDisponibles.map(([code, role]) => <button type="button" key={code} onClick={() => changerFiltre(`role:${code}`)} className={`w-full rounded-lg px-3 py-2 text-left text-xs leading-snug ${filtreRole === code ? "bg-yellow-300/10 text-yellow-100" : "text-white/65 hover:bg-white/6"}`}>{role}</button>)}
            <p className="px-3 pb-1 pt-3 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/30">Agences</p>
            <button type="button" onClick={() => changerFiltre("agence:sans_agence")} className={`w-full rounded-lg px-3 py-2 text-left text-xs ${filtreAgence === "sans_agence" ? "bg-yellow-300/10 text-yellow-100" : "text-white/65 hover:bg-white/6"}`}>Sans agence</button>
            {agencesDisponibles.map((agence) => <button type="button" key={agence.id} onClick={() => changerFiltre(`agence:${agence.id}`)} className={`w-full rounded-lg px-3 py-2 text-left text-xs ${Number(filtreAgence) === Number(agence.id) ? "bg-yellow-300/10 text-yellow-100" : "text-white/65 hover:bg-white/6"}`}>{agence.nom}</button>)}
          </div>}
        </div>
        {(recherche || filtreRole || filtreAgence) && <button type="button" onClick={() => { setRecherche(""); setFiltreRole(""); setFiltreAgence(""); setFiltreOuvert(false); }} aria-label="Réinitialiser les filtres" className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-sm text-white/55">×</button>}
      </div>

      <div className="flex items-end justify-between"><div><h2 className="text-sm font-semibold">Tous les salariés</h2><p className="text-[0.65rem] text-white/40">{livreursFiltres.length} résultat{livreursFiltres.length > 1 ? "s" : ""} sur {livreurs.length}</p></div></div>
      {chargement ? <Pulse className="py-10" /> : <section className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {livreursFiltres.length === 0 ? <div className="rounded-2xl border border-dashed border-white/12 px-4 py-12 text-center text-sm text-white/50">Aucun salarié ne correspond aux filtres.</div> : livreursFiltres.map((livreur) => (
          <article key={livreur.id} className="flex aspect-video min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#122036] to-[#0a1424] p-4 shadow-lg shadow-black/10">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0"><strong className="block truncate text-sm">{livreur.prenom} {livreur.nom}</strong><p className="truncate text-[0.6rem] text-white/35">{livreur.role}</p></div>
              {peutAffilier ? <select
                value={livreur.agence_id || ""}
                onChange={(e) => affilier(livreur, e.target.value)}
                disabled={affiliationEnCours === livreur.id}
                aria-label={`Agence de ${livreur.prenom} ${livreur.nom}`}
                className="max-w-32 rounded-lg border border-blue-300/15 bg-[#0a1628] px-2 py-1 text-[0.6rem] text-blue-100 outline-none disabled:opacity-50"
              >
                <option value="" disabled>Sans agence</option>
                {agencesDisponibles.map((agence) => <option key={agence.id} value={agence.id}>{agence.nom}</option>)}
              </select> : <span className={`max-w-28 truncate rounded-full px-2 py-1 text-[0.55rem] ${livreur.agence_id ? "bg-blue-400/10 text-blue-200" : "bg-white/6 text-white/45"}`}>{livreur.agence_nom || "Sans agence"}</span>}
            </div>

            <div className="grid grid-cols-5 gap-2 border-y border-white/7 py-3">
              <Horaire libelle="Prévu" valeur={String(livreur.heure_embauche || "--:--").slice(0, 5)} />
              <Horaire libelle="Arrivée" valeur={heure(livreur.arrival_pointed_at)} />
              <Horaire libelle="Pause" valeur={heure(livreur.start_pause_pointed_at)} />
              <Horaire libelle="Reprise" valeur={heure(livreur.end_pause_pointed_at)} />
              <Horaire libelle="Fin" valeur={heure(livreur.departure_pointed_at)} />
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0"><small className="block text-[0.55rem] text-white/35">Temps travaillé</small><strong className="text-base text-yellow-100">{duree(livreur.temps_travaille_minutes)}</strong></div>
              <div className="flex max-w-[65%] flex-wrap justify-end gap-1">
                {livreur.arrival_pointed_at ? <span className={`rounded-full px-2 py-1 text-[0.55rem] ${livreur.retard_minutes > 0 ? "bg-red-500/12 text-red-300" : "bg-emerald-500/12 text-emerald-300"}`}>{livreur.retard_minutes > 0 ? `Retard ${livreur.retard_minutes} min` : "À l’heure"}</span> : <span className="rounded-full bg-white/6 px-2 py-1 text-[0.55rem] text-white/40">Non pointé</span>}
                {livreur.depassement_pause_minutes > 0 && <span className="rounded-full bg-orange-500/12 px-2 py-1 text-[0.55rem] text-orange-300">Pause +{duree(livreur.depassement_pause_minutes)}</span>}
                {livreur.immatriculation && <span className="rounded-full bg-white/6 px-2 py-1 text-[0.55rem] text-white/45">{livreur.immatriculation}</span>}
              </div>
            </div>
          </article>
        ))}
      </section>}
    </div>
  );
}
