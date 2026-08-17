import { useContext, useEffect, useState } from "react";
import { ContactContext } from "../../contexte/contactContext.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import { UserContext } from "../../contexte/userContext.jsx";

const dateDernierMessage = (date) => {
  if (!date) return "";
  const instant = new Date(date);
  const age = Date.now() - instant.getTime();
  if (age < 24 * 60 * 60 * 1000) return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(instant);
  if (age < 7 * 24 * 60 * 60 * 1000) return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(instant);
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(instant);
};

export function Avatar({ personne, compact = false }) {
  const [source, setSource] = useState("");
  const canal = personne.type && personne.type !== "PRIVEE";
  const utilisateurId = personne.contact_id || personne.id;
  useEffect(() => {
    if (canal || !utilisateurId || !personne.avatar_img_url) return;
    let url = ""; let actif = true;
    apiFetch(`/messagerie/utilisateurs/${utilisateurId}/avatar`).then((response) => response.ok ? response.blob() : null).then((blob) => {
      if (blob && actif) { url = URL.createObjectURL(blob); setSource(url); }
    }).catch(() => {});
    return () => { actif = false; if (url) URL.revokeObjectURL(url); };
  }, [canal, personne.avatar_img_url, utilisateurId]);
  const taille = compact ? "h-10 w-10" : "h-13 w-13";
  if (source) return <img src={source} alt="" className={`${taille} shrink-0 rounded-full object-cover`} />;
  return <span className={`flex ${taille} shrink-0 items-center justify-center rounded-full text-sm font-black ${canal ? "bg-emerald-500/15 text-emerald-200" : "bg-slate-700 text-slate-200"}`}>{personne.type === "AGENCE" ? "AG" : personne.type === "LIVRAISON" ? "LV" : `${personne.prenom?.[0] || ""}${personne.nom?.[0] || ""}`}</span>;
}

export default function Contacts() {
  const [recherche, setRecherche] = useState("");
  const [resultats, setResultats] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const { listeContacts, setListeContacts, setConversationActive } = useContext(ContactContext);
  const { setPage } = useContext(MenuContext);
  const { user } = useContext(UserContext);
  const superAdministrateur = user?.role_code === "GM" || user?.role === "Super administrateur";
  const peutChercherSalarie = superAdministrateur || (user?.salarie === true && !["CLIENT", "MAGASIN"].includes(user?.role_code));

  const chargerConversations = async () => {
    try {
      const response = await apiFetch("/messagerie/conversations");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setListeContacts(data.donnees || []);
    } catch (error) { setErreur(error.message || "Chargement impossible"); }
  };

  useEffect(() => { chargerConversations(); }, []);
  useEffect(() => {
    const saisie = recherche.trim();
    if (saisie.length < 2) { setResultats([]); return; }
    const delai = setTimeout(async () => {
      setChargement(true); setErreur("");
      try {
        const response = await apiFetch(`/messagerie/salaries?saisie=${encodeURIComponent(saisie)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setResultats(data.donnees || []);
      } catch (error) { setErreur(error.message || "Recherche impossible"); }
      finally { setChargement(false); }
    }, 250);
    return () => clearTimeout(delai);
  }, [recherche]);

  const ouvrirConversation = async (personne, existante = false) => {
    try {
      let conversation = personne;
      if (!existante) {
        const response = await apiFetch("/messagerie/conversations", "POST", { body: JSON.stringify({ user_id: personne.id }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        conversation = { ...personne, id: data.donnees.id, contact_id: personne.id };
      }
      setConversationActive(conversation);
      setPage("Messagerie");
    } catch (error) { setErreur(error.message || "Conversation impossible"); }
  };

  const liste = recherche.trim().length >= 2 ? resultats : listeContacts;
  return (
    <main className="h-full min-h-0 overflow-y-auto bg-[#071426] pb-44 text-white">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#071426]/95 px-4 pb-3 pt-3 backdrop-blur"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Discussions</h1><span className="text-xl text-slate-400">⋮</span></div>
      {peutChercherSalarie && <label className="relative mt-3 block"><span className="sr-only">Trouver un utilisateur</span><svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder={superAdministrateur ? "Rechercher n’importe quel utilisateur" : "Rechercher un salarié"} className="h-10 w-full rounded-full bg-[#18283a] pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-400" /></label>}</header>
      {erreur && <p className="mt-3 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{erreur}</p>}
      <div className="flex items-center justify-between px-4 pb-2 pt-4"><h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400">{recherche.trim().length >= 2 ? (superAdministrateur ? "Utilisateurs" : "Salariés") : "Messages"}</h2><span className="text-xs text-slate-500">{liste.length}</span></div>
      <section>
        {chargement && [1, 2, 3].map((item) => <div key={item} className="mx-4 mb-2 h-16 animate-pulse rounded-xl bg-slate-800/60" />)}
        {!chargement && liste.map((personne) => (
          <button key={`${personne.id}-${personne.contact_id || "contact"}`} type="button" onClick={() => ouvrirConversation(personne, recherche.trim().length < 2)} className="flex w-full items-center gap-3 px-4 text-left transition hover:bg-white/5">
            <Avatar personne={personne} /><span className="min-w-0 flex-1 border-b border-white/5 py-3"><span className="flex items-center justify-between gap-3"><span className="block truncate text-[0.92rem] font-semibold">{personne.type && personne.type !== "PRIVEE" ? personne.nom : `${personne.prenom || ""} ${personne.nom || ""}`}</span><time className={`shrink-0 text-[0.65rem] ${personne.non_lus > 0 ? "text-emerald-400" : "text-slate-500"}`}>{dateDernierMessage(personne.dernier_message_le)}</time></span><span className="mt-1 flex items-center justify-between gap-2"><span className="block truncate text-[0.76rem] text-slate-400">{personne.dernier_message || personne.email || personne.role}</span>{personne.non_lus > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[0.6rem] font-bold text-white">{personne.non_lus}</span>}</span></span>
          </button>
        ))}
        {!chargement && liste.length === 0 && <div className="px-8 py-16 text-center"><p className="font-semibold">{recherche.trim().length >= 2 ? "Aucun utilisateur trouvé" : "Aucune discussion"}</p><p className="mt-2 text-sm text-slate-500">{recherche.trim().length >= 2 ? "Essayez un autre nom ou une adresse email." : peutChercherSalarie ? "Recherchez une personne pour démarrer une discussion." : "Un canal apparaîtra lorsqu’une livraison vous sera attribuée."}</p></div>}
      </section>
    </main>
  );
}
