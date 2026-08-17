import { useContext, useEffect, useState } from "react";
import Pulse from "../../components/Loading.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";

export default function AdminGestions() {
  const { user } = useContext(UserContext);
  const [recherche, setRecherche] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selection, setSelection] = useState(null);
  const [roleId, setRoleId] = useState("");
  const [motif, setMotif] = useState("");
  const [chargement, setChargement] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState({ type: "", texte: "" });
  const peutModifier = user?.permissions?.includes("UTILISATEURS_MODIFIER_ROLE")
    || ["RESPONSABLE_RH", "PDG", "GM"].includes(user?.role_code);

  useEffect(() => {
    let actif = true;
    apiFetch("/administration/gestion/roles")
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || "Chargement des rôles impossible");
        if (actif) setRoles((data.donnees || []).filter((role) => role.code !== "GM"));
      })
      .catch((error) => actif && setMessage({ type: "erreur", texte: error.message }));
    return () => { actif = false; };
  }, []);

  const rechercher = async (e) => {
    e.preventDefault();
    if (recherche.trim().length < 2) return setMessage({ type: "erreur", texte: "Saisissez au moins 2 caractères." });
    setChargement(true);
    setSelection(null);
    setMessage({ type: "", texte: "" });
    try {
      const res = await apiFetch(`/administration/gestion/utilisateurs?saisie=${encodeURIComponent(recherche.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Recherche impossible");
      setUtilisateurs(data.donnees || []);
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    } finally {
      setChargement(false);
    }
  };

  const choisir = (utilisateur) => {
    if (Number(utilisateur.id) === Number(user?.id)) {
      setSelection(null);
      return setMessage({ type: "erreur", texte: "Vous ne pouvez pas modifier votre propre rôle." });
    }
    setSelection(utilisateur);
    setRoleId(utilisateur.role_id || "");
    setMotif("");
    setMessage({ type: "", texte: "" });
  };

  const enregistrer = async (e) => {
    e.preventDefault();
    if (!selection || !roleId) return;
    setEnregistrement(true);
    setMessage({ type: "", texte: "" });
    try {
      const res = await apiFetch(`/administration/gestion/utilisateurs/${selection.id}/role`, "PUT", {
        body: JSON.stringify({ role_id: Number(roleId), motif: motif.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Modification impossible");
      setUtilisateurs((liste) => liste.map((item) => item.id === selection.id ? { ...item, ...data.donnees } : item));
      setSelection((actuel) => ({ ...actuel, ...data.donnees }));
      setMotif("");
      setMessage({ type: "succes", texte: `${selection.prenom} ${selection.nom} possède maintenant le rôle ${data.donnees.role}.` });
    } catch (error) {
      setMessage({ type: "erreur", texte: error.message });
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto px-4 pb-44">
      <header className="pt-2"><h1 className="text-xl font-semibold">Gestion des utilisateurs</h1><p className="text-xs text-white/55">Rechercher un compte et modifier son niveau d’accès</p></header>
      <section className="card rounded-2xl p-4">
        <h2 className="mb-1 font-semibold">Trouver un utilisateur</h2>
        <p className="mb-3 text-xs text-white/50">Recherche limitée aux informations nécessaires : nom, prénom et email.</p>
        <form onSubmit={rechercher} className="flex gap-2"><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Nom, prénom ou email" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm" /><button className="rounded-xl bg-(--yellow-zesteo) px-4 text-sm font-semibold text-black">Rechercher</button></form>
      </section>
      {message.texte && <p className={`rounded-xl border px-3 py-2 text-sm ${message.type === "erreur" ? "border-red-400/30 text-red-300" : "border-green-400/30 text-green-300"}`}>{message.texte}</p>}
      {chargement ? <Pulse className="py-10" /> : utilisateurs.length > 0 && <section className="grid gap-3 sm:grid-cols-2">{utilisateurs.map((utilisateur) => <button key={utilisateur.id} type="button" onClick={() => choisir(utilisateur)} disabled={Number(utilisateur.id) === Number(user?.id)} className={`card rounded-2xl border p-4 text-left disabled:cursor-not-allowed disabled:opacity-55 ${selection?.id === utilisateur.id ? "border-yellow-300/60" : "border-white/10"}`}><span className="font-semibold">{utilisateur.prenom} {utilisateur.nom}</span><span className="block text-xs text-white/55">{utilisateur.email}</span><span className="mt-2 inline-block rounded-full bg-white/5 px-2 py-1 text-[0.65rem] text-white/70">{utilisateur.role || "Aucun rôle"}</span><span className="ml-2 text-[0.65rem] text-white/45">{utilisateur.agence_nom || "Sans agence"}</span>{Number(utilisateur.id) === Number(user?.id) && <span className="ml-2 text-[0.65rem] text-yellow-100/60">Votre compte</span>}</button>)}</section>}
      {selection && <section className="card rounded-2xl p-4">
        <h2 className="font-semibold">Modifier le rôle de {selection.prenom} {selection.nom}</h2>
        <p className="mt-1 text-xs text-white/50">Chaque modification est contrôlée côté serveur et journalisée avec son auteur et son motif.</p>
        <form onSubmit={enregistrer} className="mt-4 flex flex-col gap-3">
          <label className="text-xs text-white/65">Nouveau rôle<select value={roleId} onChange={(e) => setRoleId(e.target.value)} disabled={!peutModifier || enregistrement} className="mt-1 w-full rounded-xl border border-white/15 bg-[#081222] px-3 py-3 text-sm text-white"><option value="">Choisir un rôle</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.libelle}{role.service ? ` — ${role.service}` : ""}</option>)}</select></label>
          <label className="text-xs text-white/65">Motif obligatoire<textarea value={motif} onChange={(e) => setMotif(e.target.value)} minLength={5} maxLength={500} required placeholder="Ex. prise de fonction validée par la direction" className="mt-1 min-h-24 w-full resize-y rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white" /></label>
          <button disabled={!peutModifier || enregistrement || Number(roleId) === Number(selection.role_id)} className="rounded-xl bg-(--yellow-zesteo) px-4 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40">{enregistrement ? "Enregistrement…" : "Confirmer le changement de rôle"}</button>
        </form>
      </section>}
    </div>
  );
}
