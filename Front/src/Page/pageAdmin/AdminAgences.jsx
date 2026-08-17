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
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState({ type: "", texte: "" });
  const [agenceEquipe, setAgenceEquipe] = useState(null);
  const [organisation, setOrganisation] = useState({ livreurs: [], camions: [] });
  const [equipages, setEquipages] = useState({});

  const peutCreer = user?.permissions?.includes("AGENCES_CREER") ?? false;
  const peutModifier = user?.permissions?.includes("AGENCES_MODIFIER") ?? false;
  const peutSupprimer = user?.permissions?.includes("AGENCES_SUPPRIMER") ?? false;
  const peutAffecterEquipage = user?.permissions?.includes("CAMIONS_AFFECTER_EQUIPAGE") ?? false;

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

  const gererEquipages = async (agence) => {
    setAgenceEquipe(agence);
    setChargement(true);
    try {
      const res = await apiFetch(`/administration/livreurs/organisation?agence_id=${agence.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Chargement impossible");
      setOrganisation(data.donnees);
      setEquipages(Object.fromEntries(data.donnees.camions.map((camion) => [
        camion.id,
        camion.equipage.map((livreur) => livreur.id),
      ])));
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    } finally {
      setChargement(false);
    }
  };

  const basculerLivreur = (camionId, livreurId) => {
    setEquipages((actuels) => {
      const equipe = actuels[camionId] || [];
      if (equipe.includes(livreurId)) return { ...actuels, [camionId]: equipe.filter((id) => id !== livreurId) };
      if (equipe.length >= 2) return actuels;
      return { ...actuels, [camionId]: [...equipe, livreurId] };
    });
  };

  const enregistrerEquipage = async (camionId) => {
    try {
      const res = await apiFetch(`/administration/livreurs/camions/${camionId}/equipage`, "PUT", {
        body: JSON.stringify({ user_ids: equipages[camionId] || [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Affectation impossible");
      setMessage({ type: "succes", texte: "L’équipage a été enregistré." });
      await gererEquipages(agenceEquipe);
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto px-4 pb-32">
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

                {(peutModifier || peutSupprimer || peutAffecterEquipage) && (
                  <div className="absolute right-2 top-2">
                    <button type="button" aria-label={`Actions pour ${agence.nom}`} onClick={() => setMenuOuvertId((id) => id === agence.id ? null : agence.id)} className="flex h-8 w-8 items-center justify-center rounded-full text-xl hover:bg-white/10">⋮</button>
                    {menuOuvertId === agence.id && (
                      <div className="absolute right-0 top-9 z-20 min-w-32 overflow-hidden rounded-xl border border-white/15 bg-[#081222] py-1 text-xs shadow-xl">
                        {peutAffecterEquipage && <button type="button" onClick={() => { setMenuOuvertId(null); gererEquipages(agence); }} className="w-full px-3 py-2 text-left text-yellow-200 hover:bg-white/10">Gérer l’équipage</button>}
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

      {agenceEquipe && peutAffecterEquipage && (
        <section className="flex flex-col gap-3 rounded-2xl border border-white/15 p-4">
          <div className="flex items-center justify-between">
            <div><h2 className="font-semibold">Équipages — {agenceEquipe.nom}</h2><p className="text-xs text-white/55">Maximum 2 livreurs par camion.</p></div>
            <button type="button" onClick={() => setAgenceEquipe(null)} className="rounded-lg border border-white/15 px-3 py-1 text-xs">Fermer</button>
          </div>
          {organisation.camions.length === 0 ? <p className="text-sm text-white/55">Aucun camion affecté à cette agence.</p> : organisation.camions.map((camion) => (
            <article key={camion.id} className="card flex flex-col gap-3 rounded-xl p-3">
              <strong>{camion.immatriculation} <span className="text-xs font-normal text-white/50">{camion.marque} {camion.modele}</span></strong>
              <div className="grid gap-2 sm:grid-cols-2">
                {organisation.livreurs.map((livreur) => {
                  const selectionne = (equipages[camion.id] || []).includes(livreur.id);
                  const complet = (equipages[camion.id] || []).length >= 2;
                  return <label key={livreur.id} className={`flex items-center gap-2 rounded-lg border p-2 text-sm ${selectionne ? "border-yellow-300/50" : "border-white/10"}`}><input type="checkbox" checked={selectionne} disabled={!selectionne && complet} onChange={() => basculerLivreur(camion.id, livreur.id)} />{livreur.prenom} {livreur.nom}</label>;
                })}
              </div>
              <button type="button" onClick={() => enregistrerEquipage(camion.id)} className="self-end rounded-lg bg-(--yellow-zesteo) px-3 py-2 text-sm font-semibold text-black">Enregistrer</button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
