import { useMemo, useState } from "react";
import IncidentIcone from "../../components/componentsIcone/IncidentIcone";

const incidents = [];
const indicateurs = [
  ["Ouverts", "text-orange-300", "bg-orange-400/40"],
  ["Urgents", "text-red-300", "bg-red-400/40"],
  ["En traitement", "text-blue-300", "bg-blue-400/40"],
  ["Résolus aujourd’hui", "text-emerald-300", "bg-emerald-400/40"],
];

export default function AdminIncidents() {
  const [recherche, setRecherche] = useState("");
  const [statut, setStatut] = useState("TOUS");
  const [priorite, setPriorite] = useState("TOUTES");

  const incidentsFiltres = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase("fr");
    return incidents.filter((incident) =>
      (!terme || [incident.titre, incident.reference, incident.agence].filter(Boolean)
        .some((valeur) => valeur.toLocaleLowerCase("fr").includes(terme))) &&
      (statut === "TOUS" || incident.statut === statut) &&
      (priorite === "TOUTES" || incident.priorite === priorite)
    );
  }, [priorite, recherche, statut]);

  const filtresActifs = recherche || statut !== "TOUS" || priorite !== "TOUTES";

  return (
    <main className="min-h-full overflow-y-auto bg-[#061326] px-5 pb-44 pt-6 text-white sm:px-7">
      <section className="relative overflow-hidden rounded-[1.8rem] border border-slate-700/70 bg-[#0d1c32] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-300/20 bg-red-400/10">
            <IncidentIcone width={27} height={27} color1="#fca5a5" />
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-red-300">Suivi opérationnel</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Incidents</h1>
            <p className="mt-1 max-w-md text-sm leading-5 text-slate-400">Centralisez les anomalies terrain et suivez leur résolution.</p>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        {indicateurs.map(([label, couleur, accent]) => (
          <article key={label} className="rounded-2xl border border-slate-700/70 bg-[#0d1c32] p-4">
            <div className={`mb-3 h-1.5 w-8 rounded-full ${accent}`} />
            <strong className={`block text-2xl font-black ${couleur}`}>0</strong>
            <span className="mt-1 block text-[0.72rem] font-medium leading-4 text-slate-400">{label}</span>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-2xl border border-slate-700/70 bg-[#0d1c32] p-3">
        <div className="flex items-center gap-2">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Rechercher un incident</span>
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Référence, agence..." className="h-11 w-full rounded-xl border border-slate-700 bg-[#08172a] pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-400" />
          </label>
          <select aria-label="Filtrer par statut" value={statut} onChange={(e) => setStatut(e.target.value)} className="h-11 max-w-28 rounded-xl border border-slate-700 bg-[#08172a] px-2 text-xs font-semibold outline-none focus:border-blue-400">
            <option value="TOUS">Tous</option><option value="OUVERT">Ouverts</option><option value="EN_COURS">En cours</option><option value="RESOLU">Résolus</option>
          </select>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <select aria-label="Filtrer par priorité" value={priorite} onChange={(e) => setPriorite(e.target.value)} className="h-9 rounded-lg border border-slate-700 bg-[#08172a] px-2 text-xs text-slate-300 outline-none focus:border-blue-400">
            <option value="TOUTES">Toutes les priorités</option><option value="CRITIQUE">Critique</option><option value="HAUTE">Haute</option><option value="NORMALE">Normale</option><option value="BASSE">Basse</option>
          </select>
          <span className="text-[0.68rem] text-slate-500">{incidentsFiltres.length} incident{incidentsFiltres.length !== 1 ? "s" : ""}</span>
        </div>
      </section>

      {incidentsFiltres.length === 0 && (
        <section className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-slate-600/70 bg-[#0a192c]/70 px-7 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
            <svg className="h-9 w-9 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 className="mt-5 text-lg font-extrabold">{filtresActifs ? "Aucun résultat" : "Aucun incident déclaré"}</h2>
          <p className="mt-2 max-w-xs text-sm leading-5 text-slate-400">{filtresActifs ? "Aucun incident ne correspond aux filtres sélectionnés." : "Tout est calme pour le moment. Les incidents ouverts apparaîtront ici dès leur déclaration."}</p>
          {filtresActifs && <button type="button" onClick={() => { setRecherche(""); setStatut("TOUS"); setPriorite("TOUTES"); }} className="mt-5 rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200">Réinitialiser les filtres</button>}
        </section>
      )}
    </main>
  );
}
