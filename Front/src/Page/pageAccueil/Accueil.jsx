import { useContext, useEffect } from "react";
import { UserContext } from "../../contexte/userContext.jsx";
import { MenuContext } from "../../contexte/menuContext.jsx";
import { LivraisonsContext } from "../../contexte/livraisonsContext.jsx";
import apiFetch from "../../utils/apiFetch.jsx";
import CardDiffusionAccueil from "./CardDiffusionAccueil.jsx";
import CardLivraisonsDash from "../../components/componentsCard/CardLivraisonsDash.jsx";
import CardPointage from "../../components/componentsCard/CardPointage.jsx";
import Pulse from "../../components/Loading.jsx";

const adresseLivraison = (livraison) => livraison
  ? [livraison.adresse?.rue, livraison.adresse?.codePostal, livraison.adresse?.ville].filter(Boolean).join(" ")
  : "Aucune étape";

export default function Accueil() {
  const { user } = useContext(UserContext);
  const { setPage } = useContext(MenuContext);
  const {
    livraisons, setLivraisons, livraisonsLoading, setLivraisonsLoading,
    livraisonsError, setLivraisonsError, setLivraisonsChargees,
    utilisateurChargeId, setUtilisateurChargeId,
  } = useContext(LivraisonsContext);

  useEffect(() => {
    if (!user?.id || (utilisateurChargeId === user.id && livraisons.length > 0)) return;
    let actif = true;
    setLivraisonsLoading(true);
    setLivraisonsError("");
    apiFetch("/livraisonsJour")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Livraisons indisponibles");
        if (actif) {
          setLivraisons(Array.isArray(data) ? data : []);
          setLivraisonsChargees(true);
          setUtilisateurChargeId(user.id);
        }
      })
      .catch((error) => actif && setLivraisonsError(error.message))
      .finally(() => actif && setLivraisonsLoading(false));
    return () => { actif = false; };
  }, [user?.id, utilisateurChargeId, livraisons.length, setLivraisons, setLivraisonsChargees, setLivraisonsError, setLivraisonsLoading, setUtilisateurChargeId]);

  const compteExterne = ["CLIENT", "MAGASIN"].includes(user?.role_code);
  const terminees = livraisons.filter((livraison) => livraison.statut === "LIVREE");
  const restantes = livraisons.filter((livraison) => !["LIVREE", "ECHEC"].includes(livraison.statut));
  const prochaine = restantes[0];
  const derniere = restantes.at(-1);
  const nombreProduits = livraisons.reduce((total, livraison) => total + (livraison.produits?.length || 0), 0);
  const statutTournee = livraisons.length === 0 ? "Aucune tournée" : terminees.length === livraisons.length ? "Terminée" : terminees.length > 0 ? "En cours" : "À démarrer";
  return (
    <div className="relative h-full w-full overflow-x-hidden overflow-y-auto pb-40">
      <div className="fd relative min-h-full w-full bg-(--bg-main) text-white">
        <div className="mx-4 flex flex-col gap-2 pt-4">
          <CardDiffusionAccueil />

          {livraisonsLoading && <Pulse className="mx-auto py-8" />}
          {!livraisonsLoading && livraisonsError && <p className="rounded-xl border border-red-400/30 p-3 text-sm text-red-300">{livraisonsError}</p>}

          {!livraisonsLoading && !livraisonsError && !compteExterne && (
            <CardLivraisonsDash
              titre="Tournée du jour"
              depart={adresseLivraison(prochaine)}
              arrivee={adresseLivraison(derniere)}
              produits={`${nombreProduits} article${nombreProduits !== 1 ? "s" : ""}`}
              totalLivraisons={livraisons.length}
              livraisonsFaite={terminees.length}
              statut={statutTournee}
              onClick={() => setPage("Livraisons")}
            />
          )}

          {!compteExterne && <CardPointage />}
        </div>
      </div>
    </div>
  );
}
