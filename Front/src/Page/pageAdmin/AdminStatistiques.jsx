import { useEffect, useMemo, useState } from "react";
import StatsIcone from "../../components/componentsIcone/StatsIcone.jsx";
import apiFetch from "../../utils/apiFetch.jsx";

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const dateCourte = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const formatEuros = (centimes) => euros.format((Number(centimes) || 0) / 100);

function Evolution({ actuel, precedent }) {
  if (!precedent) return <span className="text-slate-500">Pas de comparaison</span>;
  const valeur = Math.round(((actuel - precedent) / precedent) * 1000) / 10;
  return <span className={valeur >= 0 ? "text-emerald-300" : "text-red-300"}>{valeur >= 0 ? "+" : ""}{valeur}%</span>;
}

export default function AdminStatistiques() {
  const [periode, setPeriode] = useState("mois");
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let actif = true;
    setChargement(true);
    setErreur("");
    apiFetch(`/administration/statistiques/chiffre-affaires?periode=${periode}`)
      .then(async (response) => {
        const resultat = await response.json();
        if (!response.ok) throw new Error(resultat.message || "Statistiques indisponibles");
        if (actif) setDonnees(resultat.donnees);
      })
      .catch((error) => actif && setErreur(error.message))
      .finally(() => actif && setChargement(false));
    return () => { actif = false; };
  }, [periode]);

  const maximum = useMemo(() => Math.max(1, ...(donnees?.agences || []).map((agence) => agence.montant_centimes)), [donnees]);
  const meilleureAgence = donnees?.agences?.find((agence) => agence.montant_centimes > 0);
  const aucuneDonnee = donnees?.agences?.every((agence) => agence.jours_renseignes === 0);

  return (
    <main className="min-h-full overflow-y-auto bg-[#061326] px-5 pb-44 pt-6 text-white sm:px-7">
      <section className="relative overflow-hidden rounded-[1.8rem] border border-cyan-300/20 bg-[#0d1c32] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
        <div className="absolute -right-14 -top-16 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10"><StatsIcone width={28} height={28} color1="#67e8f9" /></div>
          <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cyan-300">Performance financière</p><h1 className="mt-1 text-3xl font-black tracking-tight">Chiffre d’affaires</h1><p className="mt-1 text-sm leading-5 text-slate-400">Comparez les performances de chaque agence.</p></div>
        </div>
        <div className="relative mt-5 grid grid-cols-3 gap-1 rounded-xl bg-[#071528] p-1">
          {[["mois", "Ce mois"], ["30j", "30 jours"], ["annee", "Année"]].map(([valeur, label]) => (
            <button key={valeur} type="button" onClick={() => setPeriode(valeur)} className={`rounded-lg px-2 py-2 text-[0.7rem] font-bold transition ${periode === valeur ? "bg-cyan-400 text-[#061326]" : "text-slate-400"}`}>{label}</button>
          ))}
        </div>
      </section>

      {chargement && <div className="mt-5 space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-slate-800/60" />)}</div>}
      {erreur && <p className="mt-5 rounded-2xl border border-red-400/50 bg-red-400/10 p-4 text-sm text-red-200">{erreur}</p>}

      {!chargement && donnees && (
        <>
          <section className="mt-5 rounded-[1.8rem] border border-slate-700/70 bg-[#0d1c32] p-5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">Chiffre d’affaires total</p>
            <div className="mt-2 flex items-end justify-between gap-3"><strong className="text-3xl font-black text-yellow-200">{formatEuros(donnees.montant_total_centimes)}</strong><span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold"><Evolution actuel={donnees.montant_total_centimes} precedent={donnees.montant_precedent_total_centimes} /></span></div>
            <p className="mt-3 text-[0.68rem] text-slate-500">Du {donnees.debut ? dateCourte.format(new Date(donnees.debut)) : "—"} au {donnees.fin ? dateCourte.format(new Date(donnees.fin)) : "—"}</p>
          </section>

          <section className="mt-3 grid grid-cols-2 gap-3">
            <article className="rounded-2xl border border-slate-700/70 bg-[#0d1c32] p-4"><p className="text-[0.62rem] font-bold uppercase tracking-wider text-slate-500">Meilleure agence</p><strong className="mt-2 block text-lg text-cyan-200">{meilleureAgence?.nom || "—"}</strong><p className="mt-1 text-xs text-slate-400">{meilleureAgence ? formatEuros(meilleureAgence.montant_centimes) : "Aucune donnée"}</p></article>
            <article className="rounded-2xl border border-slate-700/70 bg-[#0d1c32] p-4"><p className="text-[0.62rem] font-bold uppercase tracking-wider text-slate-500">Agences suivies</p><strong className="mt-2 block text-lg text-violet-200">{donnees.agences.length}</strong><p className="mt-1 text-xs text-slate-400">dans la base</p></article>
          </section>

          {aucuneDonnee && <p className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-5 text-amber-100">Aucun chiffre d’affaires n’est encore enregistré pour cette période dans la table dédiée.</p>}

          <section className="mt-5 rounded-[1.8rem] border border-slate-700/70 bg-[#0d1c32] p-5">
            <div className="mb-5"><p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-cyan-300">Classement</p><h2 className="mt-1 text-lg font-black">Chiffre d’affaires par agence</h2></div>
            <div className="space-y-5">
              {donnees.agences.map((agence, index) => (
                <article key={agence.id}>
                  <div className="mb-2 flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-black text-cyan-200">{index + 1}</span><div className="min-w-0"><h3 className="truncate text-sm font-bold">{agence.nom}</h3><p className="text-[0.62rem] text-slate-500">{agence.jours_renseignes} jour{agence.jours_renseignes !== 1 ? "s" : ""} renseigné{agence.jours_renseignes !== 1 ? "s" : ""}</p></div></div><div className="text-right"><strong className="block text-sm text-yellow-100">{formatEuros(agence.montant_centimes)}</strong><span className="text-[0.62rem]"><Evolution actuel={agence.montant_centimes} precedent={agence.montant_precedent_centimes} /></span></div></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-700" style={{ width: `${Math.max(agence.montant_centimes ? 4 : 0, (agence.montant_centimes / maximum) * 100)}%` }} /></div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
