import Tournevis from "../../components/componentsIcone/Tournevis.jsx";
import Boites from "../../components/componentsIcone/Boites.jsx";
import CamionIcone from "../../components/componentsIcone/CamionIcone.jsx";
import Interro from "../../components/componentsIcone/Interro.jsx";
import Location from "../../components/componentsIcone/Location.jsx";
import Road from "../../components/componentsIcone/Road.jsx";
import Tel from "../../components/componentsIcone/Tel.jsx";
import TimeA from "../../components/componentsIcone/TimeA.jsx";
import ShopIcone from "../../components/componentsIcone/ShopIcone.jsx";
import { useLayoutEffect, useRef, useState } from "react";
import apiFetch from "../../utils/apiFetch.jsx";

export default function CardLivraisons({
  onClick = () => {}, onMiseAJour = () => {}, fermeture = false, id, numeroDeLivraison = 1, client = {}, adresse = {}, magasin = {}, estimation = {}, produits = [], statut,
}) {
  const icones = { Installation: <Tournevis width={16} height={16} />, Depose: <Boites width={16} height={16} />, PiedCamion: <CamionIcone width={16} height={16} />, inconnu: <Interro width={16} height={16} /> };
  const adresseComplete = [adresse.rue, adresse.codePostal, adresse.ville].filter(Boolean).join(" ");
  const itineraireGoogleMaps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adresseComplete)}&travelmode=driving`;
  const [panneau, setPanneau] = useState("");
  const [motif, setMotif] = useState("CLIENT_ABSENT");
  const [description, setDescription] = useState("");
  const [nonConforme, setNonConforme] = useState(false);
  const [decharge, setDecharge] = useState(false);
  const [risqueDecharge, setRisqueDecharge] = useState("");
  const [signataireDecharge, setSignataireDecharge] = useState("");
  const [accepteRisques, setAccepteRisques] = useState(false);
  const [conserveProduit, setConserveProduit] = useState(false);
  const [message, setMessage] = useState("");
  const [traitement, setTraitement] = useState(false);
  const photoRef = useRef(null);
  const articlesEnCoursRef = useRef(new Set());
  const cardRef = useRef(null);
  const [hauteurCarte, setHauteurCarte] = useState(900);

  useLayoutEffect(() => {
    if (cardRef.current) setHauteurCarte(cardRef.current.scrollHeight);
  }, [panneau, produits, message, decharge]);

  const requete = async (url, method, body) => {
    setTraitement(true); setMessage("");
    try {
      const response = await apiFetch(url, method, { body: body instanceof FormData ? body : JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.donnees;
    } catch (error) { setMessage(error.message || "Action impossible"); return null; }
    finally { setTraitement(false); }
  };

  const changerArticle = async (produit, nouveauStatut) => {
    if (!id || !produit.id) return setMessage("Cette livraison ne possède pas d’identifiant BDD");
    if (articlesEnCoursRef.current.has(produit.id)) return;
    const ancienStatut = produit.statut || "A_LIVRER";
    articlesEnCoursRef.current.add(produit.id);
    setMessage("");
    onMiseAJour({ articleId: produit.id, articleStatut: nouveauStatut });
    try {
      const response = await apiFetch(`/livraisons/${id}/articles/${produit.id}`, "PATCH", {
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Modification impossible");
      if (data.donnees?.statut !== nouveauStatut) {
        onMiseAJour({ articleId: produit.id, articleStatut: data.donnees.statut });
      }
    } catch (error) {
      onMiseAJour({ articleId: produit.id, articleStatut: ancienStatut });
      setMessage(error.message || "Modification impossible");
    } finally {
      articlesEnCoursRef.current.delete(produit.id);
    }
  };

  const finaliser = async (resultat) => {
    const livraison = await requete(`/livraisons/${id}/finaliser`, "POST", {
      resultat, motif_echec: resultat === "ECHEC" ? motif : null, commentaire: description,
      non_conforme: nonConforme, decharge_intervention: decharge,
      decharge_risque: risqueDecharge, decharge_signataire: signataireDecharge,
      decharge_accepte_risques: accepteRisques, decharge_conserve_produit: conserveProduit,
    });
    if (livraison) { onMiseAJour({ statut: livraison.statut }); setPanneau(""); setMessage(resultat === "LIVREE" ? "Livraison validée" : "Échec enregistré"); }
  };

  const declarerIncident = async () => {
    const incident = await requete(`/livraisons/${id}/incidents`, "POST", { type: motif, description });
    if (incident) { setPanneau(""); setDescription(""); setMessage("Incident déclaré"); }
  };

  const envoyerPhoto = async (fichier) => {
    if (!fichier) return;
    const formulaire = new FormData(); formulaire.append("photo", fichier);
    const photo = await requete(`/livraisons/${id}/photos`, "POST", formulaire);
    if (photo) setMessage("Photo enregistrée");
    if (photoRef.current) photoRef.current.value = "";
  };

  return (
    <article ref={cardRef} style={{ "--delivery-card-height": `${hauteurCarte}px` }} className={`${fermeture ? "delivery-card-collapse" : "delivery-card-expand"} relative w-full shrink-0 overflow-hidden rounded-[1.4rem] border border-blue-400/30 bg-[#0d1c32] text-white shadow-[0_18px_45px_rgba(0,0,0,0.28)]`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
      <header onClick={onClick} className="flex cursor-pointer items-center gap-3 px-3 pb-3 pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-base font-black text-white shadow-lg shadow-blue-500/20">{numeroDeLivraison}</span>
        <div className="min-w-0 flex-1"><h2 className="truncate text-base font-black">{client.nom} {client.prenom}</h2><p className="mt-0.5 flex items-center gap-1.5 truncate text-[0.65rem] text-slate-400"><ShopIcone width={11} height={11} /><span>{magasin.nom || "Magasin non renseigné"}</span></p></div>
        <div className="flex items-center gap-2"><div className="text-right"><p className="text-[0.52rem] uppercase text-slate-500">Arrivée</p><strong className="text-lg font-black text-cyan-300">{estimation.heure || "—"}</strong></div><svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      </header>

      <div className="mx-3 rounded-xl bg-[#08172a] px-3 py-2.5">
        <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs font-semibold">{adresse.rue}</p><p className="truncate text-[0.65rem] text-slate-400">{adresse.codePostal} {adresse.ville}</p></div><strong className="shrink-0 text-[0.65rem] text-yellow-200">{estimation.creneau || "—"}</strong></div>
        <div className="mt-2 flex items-center gap-4 border-t border-slate-700/60 pt-2 text-[0.65rem]">
          <span className="flex items-center gap-1.5"><TimeA width={13} height={13} /><strong>{estimation.dureeProchaineLivraison || "—"}</strong></span>
          <span className="flex items-center gap-1.5"><Road width={13} height={13} /><strong>{estimation.distanceProchaineLivraison || "—"}</strong></span>
        </div>
      </div>

      <section className="px-3 py-3">
        <div className="mb-1.5 flex items-center justify-between"><h3 className="text-[0.65rem] font-extrabold uppercase tracking-wider text-slate-400">Articles</h3><span className="text-[0.6rem] text-slate-500">{produits.length}</span></div>
        <div className="overflow-hidden rounded-xl border border-white/6">{produits.map((produit, index) => <div key={`${produit.nom}-${index}`} className={`flex items-center gap-2 px-2.5 py-2 ${index > 0 ? "border-t border-white/6" : ""}`}><span className="flex h-7 w-7 shrink-0 items-center justify-center [&>div]:flex [&_svg]:h-4 [&_svg]:w-4 text-slate-300">{icones[produit.categorie] || icones.inconnu}</span><span className="min-w-0 flex-1"><strong className={`block truncate text-[0.7rem] ${produit.statut === "LIVRE" ? "text-slate-500 line-through" : "text-slate-100"}`}>{produit.nom}</strong>{produit.reprise && <span className="text-[0.52rem] text-slate-500">Reprise prévue</span>}</span><button type="button" disabled={traitement} title="Signaler un article défectueux" aria-label={`Signaler ${produit.nom} défectueux`} onClick={() => changerArticle(produit, produit.statut === "DEFECTUEUX" ? "A_LIVRER" : "DEFECTUEUX")} className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${produit.statut === "DEFECTUEUX" ? "border-red-400 bg-red-400 text-white" : "border-slate-700 text-slate-500"}`}>!</button><button type="button" disabled={traitement} aria-label={`Marquer ${produit.nom} comme livré`} onClick={() => changerArticle(produit, produit.statut === "LIVRE" ? "A_LIVRER" : "LIVRE")} className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${produit.statut === "LIVRE" ? "border-emerald-400 bg-emerald-400 text-[#071426]" : "border-slate-600 text-transparent"}`}>✓</button></div>)}</div>
      </section>

      {message && <p className="mx-3 mb-2 rounded-lg bg-white/5 px-3 py-2 text-[0.65rem] text-slate-300">{message}</p>}

      {panneau && panneau !== "ACTIONS" && <section className="mx-3 mb-3 rounded-xl border border-white/10 bg-[#08172a] p-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><strong className="text-xs">{panneau === "ECHEC" ? "Échec de livraison" : panneau === "INCIDENT" ? "Déclarer un incident" : "Validation"}</strong><button type="button" onClick={() => setPanneau("")} className="text-slate-500">×</button></div>
        {(panneau === "ECHEC" || panneau === "INCIDENT") && <select value={motif} onChange={(e) => setMotif(e.target.value)} className="mt-2 h-9 w-full rounded-lg border border-slate-700 bg-[#102139] px-2 text-xs"><option value="CLIENT_ABSENT">Client absent</option><option value="ADRESSE_INCONNUE">Adresse inconnue</option><option value="ACCES_IMPOSSIBLE">Accès impossible</option><option value="ARTICLE_ENDOMMAGE">Article endommagé</option><option value="AUTRE">Autre</option></select>}
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Commentaire..." className="mt-2 min-h-16 w-full resize-none rounded-lg border border-slate-700 bg-[#102139] p-2 text-xs outline-none" />
        {panneau === "VALIDER" && <div className="mt-2 space-y-2 text-[0.68rem]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={nonConforme} onChange={(e) => setNonConforme(e.target.checked)} /> Livraison non conforme</label>
          <label className="flex items-start gap-2 rounded-lg border border-slate-700 p-2"><input className="mt-0.5" type="checkbox" checked={decharge} onChange={(e) => setDecharge(e.target.checked)} /><span><strong className="block text-slate-200">Décharge d’intervention nécessaire</strong><span className="text-[0.6rem] text-slate-500">Le client demande la mise en place malgré un risque de dommage.</span></span></label>
          {decharge && <div className="space-y-2 rounded-lg bg-black/15 p-2">
            <textarea value={risqueDecharge} onChange={(e) => setRisqueDecharge(e.target.value)} placeholder="Décrire précisément le risque pour le produit ou le logement..." className="min-h-20 w-full resize-none rounded-lg border border-slate-700 bg-[#102139] p-2 text-xs outline-none" />
            <input value={signataireDecharge} onChange={(e) => setSignataireDecharge(e.target.value)} placeholder="Nom et prénom du client signataire" className="h-9 w-full rounded-lg border border-slate-700 bg-[#102139] px-2 text-xs outline-none" />
            <label className="flex items-start gap-2 leading-4"><input className="mt-0.5" type="checkbox" checked={accepteRisques} onChange={(e) => setAccepteRisques(e.target.checked)} /><span>Je demande la réalisation de l’intervention malgré les risques décrits pour le produit ou mon logement.</span></label>
            <label className="flex items-start gap-2 leading-4"><input className="mt-0.5" type="checkbox" checked={conserveProduit} onChange={(e) => setConserveProduit(e.target.checked)} /><span>Je m’engage à accepter et conserver le produit après cette intervention.</span></label>
            <p className="text-[0.56rem] leading-3 text-slate-500">À compléter par le client. L’identité, les consentements et l’heure de validation seront enregistrés.</p>
          </div>}
        </div>}
        <button type="button" disabled={traitement || (panneau === "INCIDENT" && description.trim().length < 3) || (panneau === "VALIDER" && decharge && (risqueDecharge.trim().length < 10 || signataireDecharge.trim().length < 3 || !accepteRisques || !conserveProduit))} onClick={() => panneau === "INCIDENT" ? declarerIncident() : finaliser(panneau === "ECHEC" ? "ECHEC" : "LIVREE")} className={`mt-3 h-9 w-full rounded-lg text-xs font-bold disabled:opacity-40 ${panneau === "VALIDER" ? "bg-emerald-400 text-[#071426]" : "bg-red-400 text-white"}`}>Confirmer</button>
      </section>}

      <footer className="border-t border-white/6 bg-black/10 p-3">
        <div className="flex items-center gap-2 text-[0.68rem]">
          <a href={itineraireGoogleMaps} target="_blank" rel="noreferrer" className="flex h-8 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 text-slate-300"><Location /><span>Itinéraire</span></a>
          <a href={client.telephone ? `tel:${client.telephone.replace(/\s/g, "")}` : undefined} className={`flex h-8 flex-1 items-center justify-center gap-2 rounded-lg border ${client.telephone ? "border-slate-700 text-slate-300" : "pointer-events-none border-slate-800 text-slate-600"}`}><Tel /><span>Appeler</span></a>
        </div>
        {panneau === "ACTIONS" && <div className="mt-2 overflow-hidden rounded-xl border border-slate-700 bg-[#0b192b] text-left text-xs">
          <button type="button" onClick={() => setPanneau("ECHEC")} className="flex w-full items-center gap-3 border-b border-white/6 px-3 py-2.5 text-slate-200"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600">×</span>Déclarer un échec</button>
          <button type="button" onClick={() => setPanneau("INCIDENT")} className="flex w-full items-center gap-3 border-b border-white/6 px-3 py-2.5 text-slate-200"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600">!</span>Signaler un incident</button>
          <label htmlFor={`photo-livraison-${id}`} onClick={() => setPanneau("")} className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-slate-200"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600">○</span>Prendre une photo</label>
        </div>}
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => setPanneau("VALIDER")} className="h-10 flex-1 rounded-xl bg-yellow-300 text-[0.7rem] font-extrabold text-[#071426]">Terminer la livraison</button>
          <button type="button" onClick={() => setPanneau((actuel) => actuel === "ACTIONS" ? "" : "ACTIONS")} aria-label="Autres actions" className="h-10 w-11 rounded-xl border border-slate-700 text-lg text-slate-300">•••</button>
        </div>
        <input id={`photo-livraison-${id}`} ref={photoRef} type="file" accept="image/*" capture="environment" onChange={(e) => envoyerPhoto(e.target.files?.[0])} className="hidden" />
      </footer>
    </article>
  );
}
