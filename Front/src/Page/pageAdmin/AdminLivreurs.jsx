import { useCallback, useContext, useEffect, useState } from "react";
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
  const [chargement, setChargement] = useState(false);
  const [affiliationEnCours, setAffiliationEnCours] = useState(null);
  const [message, setMessage] = useState({ type: "", texte: "" });
  const [messageMasque, setMessageMasque] = useState(false);
  const peutAffilier = user?.permissions?.includes("AGENCES_AFFECTER_SALARIE");
  const agencesDisponibles = user?.role_code === "CHEF_AGENCE"
    ? listeAgences.filter((agence) => Number(agence.id) === Number(user.agence_id))
    : listeAgences;

  const chargerLivreurs = useCallback(async () => {
    setChargement(true);
    try {
      const res = await apiFetch("/administration/livreurs/tous");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Chargement impossible");
      setLivreurs(data.donnees || []);
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

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-5 overflow-y-auto px-4 pb-32">
      <header className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-yellow-200/70">Équipe du jour</p><h1 className="mt-1 text-2xl font-semibold">Mes livreurs</h1><p className="text-xs text-white/45">Horaires, pauses et temps travaillé</p></div>
      </header>
      {message.texte && <p className={`rounded-xl border px-3 py-2 text-sm transition-all duration-500 ${messageMasque ? "translate-y-1 opacity-0" : "opacity-100"} ${message.type === "erreur" ? "text-red-300" : "text-green-300"}`}>{message.texte}</p>}

      <div className="flex items-end justify-between"><div><h2 className="text-sm font-semibold">Tous les salariés</h2><p className="text-[0.65rem] text-white/40">{livreurs.length} salarié{livreurs.length > 1 ? "s" : ""}</p></div></div>
      {chargement ? <Pulse className="py-10" /> : <section className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {livreurs.length === 0 ? <div className="rounded-2xl border border-dashed border-white/12 px-4 py-12 text-center text-sm text-white/50">Aucun salarié</div> : livreurs.map((livreur) => (
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
