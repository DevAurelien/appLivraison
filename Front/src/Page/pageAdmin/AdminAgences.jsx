import { useCallback, useContext, useEffect, useState } from "react";

import Pulse from "../../components/Loading.jsx";
import { AgencesContext } from "../../contexte/agencesContext.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import apiFetch from "../../utils/apiFetch";

const formulaireInitial = {
  nom: "",
  nomComplet: "",
  heureEmbauche: "09:00",
};

export default function AdminAgences() {
  const { user } = useContext(UserContext);
  const { listeAgences, recupererAgences } = useContext(AgencesContext);
  const [form, setForm] = useState(formulaireInitial);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [agenceEnModificationId, setAgenceEnModificationId] = useState(null);
  const [menuOuvertId, setMenuOuvertId] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [chargementTournees, setChargementTournees] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const [tourneeEnregistrement, setTourneeEnregistrement] = useState(null);
  const [message, setMessage] = useState({ type: "", texte: "" });
  const [agenceTournees, setAgenceTournees] = useState(null);
  const [organisationTournees, setOrganisationTournees] = useState({ tournees: [], camions: [] });

  const peutCreer = user?.permissions?.includes("AGENCES_CREER") ?? false;
  const peutModifier = user?.permissions?.includes("AGENCES_MODIFIER") ?? false;
  const peutSupprimer = user?.permissions?.includes("AGENCES_SUPPRIMER") ?? false;
  const peutGererTournees = user?.permissions?.some((permission) => ["PLANNING_LIRE", "PLANNING_MODIFIER", "CAMIONS_MODIFIER"].includes(permission)) ?? false;

  const chargerAgences = useCallback(async () => {
    setChargement(true);
    await recupererAgences();
    setChargement(false);
  }, [recupererAgences]);

  useEffect(() => {
    const chargementInitial = window.setTimeout(chargerAgences, 0);
    return () => window.clearTimeout(chargementInitial);
  }, [chargerAgences]);

  const fermerFormulaire = () => {
    setFormulaireOuvert(false);
    setAgenceEnModificationId(null);
    setForm(formulaireInitial);
  };

  const ouvrirCreation = () => {
    setMessage({ type: "", texte: "" });
    setAgenceEnModificationId(null);
    setForm(formulaireInitial);
    setFormulaireOuvert(true);
  };

  const ouvrirModification = (agence) => {
    setMessage({ type: "", texte: "" });
    setMenuOuvertId(null);
    setAgenceEnModificationId(agence.id);
    setForm({
      nom: agence.nom || "",
      nomComplet: agence.nom_complet || "",
      heureEmbauche: String(agence.heure_embauche || "09:00").slice(0, 5),
    });
    setFormulaireOuvert(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nom = form.nom.trim();
    const nomComplet = form.nomComplet.trim();

    if (!nom || !nomComplet || !/^([01]\d|2[0-3]):[0-5]\d$/.test(form.heureEmbauche)) {
      setMessage({ type: "erreur", texte: "Renseigne un nom et une heure valides." });
      return;
    }

    setEnregistrement(true);
    setMessage({ type: "", texte: "" });

    try {
      const endpoint = agenceEnModificationId
        ? `/administration/agences/modification/${agenceEnModificationId}`
        : "/creation/agences";
      const methode = agenceEnModificationId ? "PATCH" : "POST";
      const res = await apiFetch(endpoint, methode, {
        body: JSON.stringify({
          nom,
          nomComplet,
          heure_embauche: `${form.heureEmbauche}:00`,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Enregistrement impossible");

      await recupererAgences();
      setMessage({
        type: "succes",
        texte: agenceEnModificationId
          ? "L’agence a bien été modifiée."
          : "L’agence a bien été créée.",
      });
      fermerFormulaire();
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    } finally {
      setEnregistrement(false);
    }
  };

  const supprimerUneAgence = async (agence) => {
    setMenuOuvertId(null);
    if (!window.confirm(`Supprimer définitivement l’agence « ${agence.nom} » ?`)) return;

    try {
      const res = await apiFetch(
        `/administration/agences/suppression/${agence.id}`,
        "DELETE",
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Suppression impossible");

      await recupererAgences();
      setMessage({ type: "succes", texte: "L’agence a été supprimée." });
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    }
  };

  const gererTournees = async (agence) => {
    setAgenceTournees(agence);
    setChargementTournees(true);
    setMessage({ type: "", texte: "" });
    try {
      const res = await apiFetch(`/administration/agences/${agence.id}/tournees`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Chargement impossible");
      setOrganisationTournees(data.donnees);
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    } finally {
      setChargementTournees(false);
    }
  };

  const affecterCamionTournee = async (tourneeId, camionId) => {
    if (!camionId) return;
    setTourneeEnregistrement(tourneeId);
    try {
      const res = await apiFetch(`/administration/agences/${agenceTournees.id}/tournees/${tourneeId}/camion`, "PUT", {
        body: JSON.stringify({ camion_id: Number(camionId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Affectation impossible");
      setMessage({ type: "succes", texte: "Le camion a été affecté à la tournée." });
      await gererTournees(agenceTournees);
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    } finally {
      setTourneeEnregistrement(null);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto px-4 pb-44">
      <header className="flex items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Mes agences</h1>
          <p className="text-xs text-white/55">Gestion des sites et horaires d’embauche</p>
        </div>
        {peutCreer && !formulaireOuvert && (
          <button
            type="button"
            onClick={ouvrirCreation}
            className="rounded-xl bg-(--yellow-zesteo) px-4 py-2 text-sm font-semibold text-black"
          >
            Nouvelle agence
          </button>
        )}
      </header>

      {message.texte && (
        <p className={`rounded-xl border px-3 py-2 text-sm ${
          message.type === "erreur"
            ? "border-red-400/30 bg-red-500/10 text-red-300"
            : "border-green-400/30 bg-green-500/10 text-green-300"
        }`}>
          {message.texte}
        </p>
      )}

      {formulaireOuvert && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 rounded-2xl p-4">
          <div>
            <h2 className="font-semibold">
              {agenceEnModificationId ? "Modifier l’agence" : "Créer une agence"}
            </h2>
            <p className="text-xs text-white/55">Les champs marqués sont obligatoires.</p>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            Nom court
            <input
              required
              value={form.nom}
              onChange={(e) => setForm((actuel) => ({ ...actuel, nom: e.target.value }))}
              placeholder="Ex. Villeneuve"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-yellow-300/60"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Nom complet
            <input
              required
              value={form.nomComplet}
              onChange={(e) => setForm((actuel) => ({ ...actuel, nomComplet: e.target.value }))}
              placeholder="Ex. Agence de Villeneuve-sur-Lot"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-yellow-300/60"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Heure d’embauche
            <input
              required
              type="time"
              value={form.heureEmbauche}
              onChange={(e) => setForm((actuel) => ({ ...actuel, heureEmbauche: e.target.value }))}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-yellow-300/60"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={fermerFormulaire} className="rounded-xl border border-white/15 px-4 py-2 text-sm">
              Annuler
            </button>
            <button disabled={enregistrement} type="submit" className="min-w-28 rounded-xl bg-(--yellow-zesteo) px-4 py-2 text-sm font-semibold text-black disabled:opacity-50">
              {enregistrement ? <Pulse /> : agenceEnModificationId ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Agences enregistrées</h2>
          {!chargement && <span className="text-xs text-white/50">{listeAgences.length} agence(s)</span>}
        </div>

        {chargement ? (
          <Pulse className="py-12" />
        ) : listeAgences.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 py-10 text-center text-sm text-white/55">Aucune agence enregistrée.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {listeAgences.map((agence) => (
              <article key={agence.id} className="card relative flex min-h-28 flex-col justify-center gap-2 rounded-2xl p-4 pr-12">
                <strong>{agence.nom}</strong>
                <p className="text-sm text-white/65">{agence.nom_complet || "Nom complet non renseigné"}</p>
                <p className="text-xs text-white/50">
                  Embauche : {String(agence.heure_embauche || "--:--").slice(0, 5)}
                </p>
                {peutGererTournees && <button type="button" onClick={() => gererTournees(agence)} className="mt-1 self-start rounded-lg border border-yellow-300/20 bg-yellow-300/5 px-3 py-2 text-xs text-yellow-100">Gérer les tournées</button>}

                {(peutModifier || peutSupprimer) && (
                  <div className="absolute right-2 top-2">
                    <button type="button" aria-label={`Actions pour ${agence.nom}`} onClick={() => setMenuOuvertId((id) => id === agence.id ? null : agence.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-xl hover:bg-white/10">⋮</button>
                    {menuOuvertId === agence.id && (
                      <div className="absolute right-0 top-9 z-20 min-w-32 overflow-hidden rounded-xl border border-white/15 bg-[#081222] py-1 text-xs shadow-xl">
                        {peutModifier && <button type="button" onClick={() => ouvrirModification(agence)} className="w-full px-3 py-2 text-left hover:bg-white/10">Modifier</button>}
                        {peutSupprimer && <button type="button" onClick={() => supprimerUneAgence(agence)} className="w-full px-3 py-2 text-left text-red-300 hover:bg-white/10">Supprimer</button>}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {agenceTournees && peutGererTournees && <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center" onMouseDown={(e) => e.target === e.currentTarget && setAgenceTournees(null)}>
        <section className="flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/12 bg-[#081426] shadow-2xl sm:max-w-2xl sm:rounded-3xl">
          <div className="flex items-start justify-between border-b border-white/8 px-5 py-4">
            <div><p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-yellow-200/60">Planification</p><h2 className="mt-1 text-lg font-semibold">Tournées · {agenceTournees.nom}</h2><p className="text-xs text-white/45">Affectez un camion de l’agence à chaque tournée</p></div>
            <button type="button" onClick={() => setAgenceTournees(null)} aria-label="Fermer" className="flex size-9 items-center justify-center rounded-full border border-white/10 text-lg text-white/60 hover:bg-white/8">×</button>
          </div>

          <div className="overflow-y-auto p-4 sm:p-5">
            {chargementTournees ? <Pulse className="py-14" /> : organisationTournees.tournees.length === 0 ? <div className="rounded-2xl border border-dashed border-white/12 px-4 py-12 text-center"><p className="text-sm text-white/60">Aucune tournée enregistrée</p><p className="mt-1 text-xs text-white/35">Les tournées apparaîtront ici dès que le planning sera créé.</p></div> : organisationTournees.camions.length === 0 ? <div className="rounded-2xl border border-orange-300/15 bg-orange-400/5 px-4 py-10 text-center text-sm text-orange-200">Aucun camion n’est affecté à cette agence.</div> : <div className="flex flex-col gap-3">{organisationTournees.tournees.map((tournee) => <article key={tournee.id} className="rounded-2xl border border-white/10 bg-white/3 p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><strong>Tournée #{tournee.id}</strong><p className="text-xs text-white/40">{new Date(tournee.date_tournee).toLocaleDateString("fr-FR")} · {String(tournee.heure_depart_prevue || "--:--").slice(0, 5)}</p></div><span className="rounded-full bg-white/5 px-2 py-1 text-[0.6rem] text-white/50">{tournee.statut}</span></div><select value={tournee.camion_id || ""} disabled={["TERMINEE", "ANNULEE"].includes(tournee.statut) || tourneeEnregistrement === tournee.id} onChange={(e) => affecterCamionTournee(tournee.id, e.target.value)} className="w-full rounded-xl border border-white/12 bg-[#0b192d] px-3 py-3 text-sm text-white"><option value="">Choisir un camion</option>{organisationTournees.camions.map((camion) => <option key={camion.id} value={camion.id}>{camion.immatriculation} · {camion.marque} {camion.modele}</option>)}</select></article>)}</div>}
          </div>
        </section>
      </div>}
    </div>
  );
}
