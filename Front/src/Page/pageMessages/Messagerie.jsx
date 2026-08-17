import { useContext, useEffect, useRef, useState } from "react";
import { ContactContext } from "../../contexte/contactContext.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import { UserContext } from "../../contexte/userContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import { Avatar } from "./Contacts.jsx";

const horodatage = (date) => {
  const instant = new Date(date);
  return Date.now() - instant.getTime() < 24 * 60 * 60 * 1000
    ? new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(instant)
    : new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(instant);
};

export default function Messagerie() {
  const { conversationActive } = useContext(ContactContext);
  const { user } = useContext(UserContext);
  const { setPage } = useContext(MenuContext);
  const [messages, setMessages] = useState([]);
  const [saisie, setSaisie] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const finRef = useRef(null);
  const estCanal = conversationActive?.type && conversationActive.type !== "PRIVEE";
  const baseEndpoint = estCanal ? "/messagerie/canaux" : "/messagerie/conversations";

  useEffect(() => {
    if (!conversationActive?.id) { setPage("Contacts"); return; }
    let actif = true;
    const charger = async () => {
      try {
        const response = await apiFetch(`${baseEndpoint}/${conversationActive.id}/messages`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        if (actif) setMessages(data.donnees || []);
      } catch (error) { if (actif) setErreur(error.message || "Messages indisponibles"); }
    };
    charger();
    const intervalle = setInterval(charger, 5000);
    return () => { actif = false; clearInterval(intervalle); };
  }, [baseEndpoint, conversationActive?.id, setPage]);
  useEffect(() => { finRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const envoyer = async (event) => {
    event.preventDefault();
    const contenu = saisie.trim();
    if (!contenu || envoi) return;
    setEnvoi(true); setErreur("");
    try {
      const response = await apiFetch(`${baseEndpoint}/${conversationActive.id}/messages`, "POST", { body: JSON.stringify({ contenu }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessages((actuels) => [...actuels, data.donnees]); setSaisie("");
    } catch (error) { setErreur(error.message || "Envoi impossible"); }
    finally { setEnvoi(false); }
  };

  if (!conversationActive) return null;
  return (
    <main className="flex h-full min-h-0 flex-col bg-[#061326] text-white">
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-800 px-3 py-2"><button type="button" onClick={() => setPage("Contacts")} className="flex h-10 w-8 items-center justify-center text-2xl">‹</button><Avatar personne={conversationActive} compact /><div className="min-w-0"><h1 className="truncate text-sm font-extrabold">{estCanal ? conversationActive.nom : `${conversationActive.prenom || ""} ${conversationActive.nom || ""}`}</h1><p className="truncate text-[0.68rem] text-slate-500">{conversationActive.role || conversationActive.email}</p></div></header>
      <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-36">
        {erreur && <p className="mb-3 rounded-xl bg-red-400/10 p-3 text-xs text-red-200">{erreur}</p>}
        {messages.length === 0 && <div className="py-16 text-center"><p className="font-bold">Commencez la conversation</p><p className="mt-1 text-xs text-slate-500">Vos messages sont privés entre ces deux comptes.</p></div>}
        <div className="space-y-3">{messages.map((message) => { const mien = Number(message.sender_id) === Number(user.id); return <div key={message.id} className={`flex ${mien ? "justify-end" : "justify-start"}`}><div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${mien ? "rounded-br-md bg-[#075e54] text-white" : "rounded-bl-md bg-[#14243b] text-slate-100"}`}>{estCanal && !mien && <p className="mb-1 text-[0.62rem] font-bold text-emerald-300">{message.sender_prenom} {message.sender_nom}</p>}<p className="whitespace-pre-wrap break-words text-sm">{message.contenu}</p><p className={`mt-1 text-right text-[0.58rem] ${mien ? "text-emerald-100/70" : "text-slate-500"}`}>{horodatage(message.created_at)}</p></div></div>; })}</div><div ref={finRef} />
      </section>
      <form onSubmit={envoyer} className="fixed bottom-24 left-1/2 z-20 flex w-full max-w-xl -translate-x-1/2 gap-2 px-4"><input value={saisie} onChange={(e) => setSaisie(e.target.value)} maxLength={2000} placeholder="Écrire un message..." className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-700 bg-[#102139] px-4 text-sm shadow-xl outline-none placeholder:text-slate-500 focus:border-blue-400" /><button type="submit" disabled={!saisie.trim() || envoi} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-xl font-black text-[#061326] disabled:opacity-40">↑</button></form>
    </main>
  );
}
