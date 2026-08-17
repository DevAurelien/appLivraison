import { useContext, useEffect, useState } from "react";
import apiFetch from "../../utils/apiFetch.jsx";
import CardMessage from "../../components/componentsCard/CardMessage.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import Pulse from "../../components/Loading.jsx";

export default function CardDiffusionAccueil() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [cibles, setCibles] = useState(null);
  const [ouvert, setOuvert] = useState(false);
  const [formulaire, setFormulaire] = useState({ titre: "Information", contenu: "", cible_type: "TOUS_SALARIES", duree_jours: 1 });
  const [recherche, setRecherche] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [chargementMessages, setChargementMessages] = useState(true);

  useEffect(() => {
    apiFetch("/accueil/messages").then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => ok && setMessages(data.donnees || [])).catch(() => {})
      .finally(() => setChargementMessages(false));
    apiFetch("/accueil/messages/cibles").then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => ok && setCibles(data.donnees)).catch(() => {});
  }, []);

  useEffect(() => {
    if (formulaire.cible_type !== "UTILISATEUR" || recherche.trim().length < 2) { setUtilisateurs([]); return; }
    const delai = setTimeout(() => apiFetch(`/accueil/messages/utilisateurs?saisie=${encodeURIComponent(recherche.trim())}`)
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => ok && setUtilisateurs(data.donnees || [])).catch(() => {}), 250);
    return () => clearTimeout(delai);
  }, [formulaire.cible_type, recherche]);

  const publier = async (event) => {
    event.preventDefault(); setEnvoi(true); setErreur("");
    try {
      const res = await apiFetch("/accueil/messages", "POST", { body: JSON.stringify(formulaire) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const actualises = await apiFetch("/accueil/messages");
      const listeActualisee = await actualises.json();
      if (actualises.ok) setMessages(listeActualisee.donnees || []);
      setFormulaire((actuel) => ({ ...actuel, contenu: "" })); setOuvert(false);
    } catch (error) { setErreur(error.message || "Publication impossible"); }
    finally { setEnvoi(false); }
  };

  const message = messages[0];
  const signature = message
    ? `- ${message.auteur_prenom || ""} ${message.auteur_nom || ""} ${message.auteur_role || ""}`.trim()
    : "";
  if (chargementMessages) return <div className="card flex min-h-24 w-full items-center justify-center rounded-xl"><Pulse /></div>;
  if (!message && !cibles) return null;
  return <section className="relative">
    {message && <CardMessage
      titre={message.titre}
      signature={signature}
    >{message.contenu}</CardMessage>}
    {cibles && <button type="button" onClick={() => setOuvert((valeur) => !valeur)} className={`${message ? "absolute right-2 top-1" : "ml-auto flex"} rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-[0.65rem] text-white/60`}>{ouvert ? "Fermer" : message ? "Écrire" : "Publier une information"}</button>}
    {ouvert && <form onSubmit={publier} className="mt-2 rounded-xl border border-white/10 bg-[#0d1c32] p-3 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <input value={formulaire.titre} onChange={(e) => setFormulaire({ ...formulaire, titre: e.target.value })} placeholder="Titre" className="h-9 rounded-lg border border-slate-700 bg-[#08172a] px-2 outline-none" />
        <select value={formulaire.cible_type} onChange={(e) => setFormulaire({ ...formulaire, cible_type: e.target.value, cible_agence_id: null, cible_role_id: null, cible_user_id: null })} className="h-9 rounded-lg border border-slate-700 bg-[#08172a] px-2 outline-none"><option value="TOUS_SALARIES">Tous les salariés</option><option value="TOUS_CLIENTS">Tous les clients</option><option value="AGENCE">Une agence</option><option value="ROLE">Un rôle</option><option value="UTILISATEUR">Une personne</option></select>
      </div>
      {formulaire.cible_type === "AGENCE" && <select value={formulaire.cible_agence_id || ""} onChange={(e) => setFormulaire({ ...formulaire, cible_agence_id: Number(e.target.value) })} className="mt-2 h-9 w-full rounded-lg border border-slate-700 bg-[#08172a] px-2"><option value="">Choisir une agence</option>{cibles.agences.map((agence) => <option key={agence.id} value={agence.id}>{agence.nom}</option>)}</select>}
      {formulaire.cible_type === "ROLE" && <select value={formulaire.cible_role_id || ""} onChange={(e) => setFormulaire({ ...formulaire, cible_role_id: Number(e.target.value) })} className="mt-2 h-9 w-full rounded-lg border border-slate-700 bg-[#08172a] px-2"><option value="">Choisir un rôle</option>{cibles.roles.map((role) => <option key={role.id} value={role.id}>{role.libelle}</option>)}</select>}
      {formulaire.cible_type === "UTILISATEUR" && <div className="relative mt-2"><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Nom, prénom ou email" className="h-9 w-full rounded-lg border border-slate-700 bg-[#08172a] px-2 outline-none" />{utilisateurs.length > 0 && <div className="absolute inset-x-0 top-10 z-20 overflow-hidden rounded-lg border border-slate-700 bg-[#102139] shadow-xl">{utilisateurs.map((personne) => <button key={personne.id} type="button" onClick={() => { setFormulaire({ ...formulaire, cible_user_id: personne.id }); setRecherche(`${personne.prenom} ${personne.nom}`); setUtilisateurs([]); }} className="block w-full border-b border-white/5 px-3 py-2 text-left"><strong>{personne.prenom} {personne.nom}</strong><span className="ml-2 text-white/40">{personne.role}</span></button>)}</div>}</div>}
      <textarea value={formulaire.contenu} onChange={(e) => setFormulaire({ ...formulaire, contenu: e.target.value })} placeholder="Votre message..." maxLength={2000} className="mt-2 min-h-20 w-full resize-none rounded-lg border border-slate-700 bg-[#08172a] p-2 outline-none" />
      <p className="mt-1 text-right text-[0.65rem] italic text-white/45">- {user?.prenom || ""} {user?.nom || ""} {user?.role || ""}</p>
      <div className="mt-2 flex items-center justify-between gap-2"><select value={formulaire.duree_jours} onChange={(e) => setFormulaire({ ...formulaire, duree_jours: Number(e.target.value) })} className="h-9 rounded-lg border border-slate-700 bg-[#08172a] px-2"><option value={1}>Visible 1 jour</option><option value={3}>3 jours</option><option value={7}>7 jours</option><option value="">Sans expiration</option></select><button disabled={envoi || formulaire.contenu.trim().length < 3} className="h-9 rounded-lg bg-yellow-300 px-4 font-bold text-[#071426] disabled:opacity-40">Publier</button></div>
      {erreur && <p className="mt-2 text-red-300">{erreur}</p>}
    </form>}
  </section>;
}
