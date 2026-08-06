import {
  useContext,
  useEffect,
  useState,
} from "react";

import CardLivraisons from "./CardLivraisons.jsx";
import CardLivReduit from "./CardLivReduit.jsx";
import Pulse from "../../components/Loading.jsx";

import apiFetch from "../../utils/apiFetch.jsx";

import {
  UserContext,
} from "../../contexte/userContext.jsx";

import {
  LivraisonsContext,
} from "../../contexte/livraisonsContext.jsx";

export default function Livraisons() {
  const { user } = useContext(UserContext);

  const {
    livraisons,
    setLivraisons,

    livraisonsLoading,
    setLivraisonsLoading,

    livraisonsError,
    setLivraisonsError,

    livraisonsChargees,
    setLivraisonsChargees,

    utilisateurChargeId,
    setUtilisateurChargeId,
  } = useContext(LivraisonsContext);

  const [livActif, setLivActif] = useState(0);

  useEffect(() => {
    const recupererLivraisons = async () => {
      if (!user?.id) {
        return;
      }

      if (
        livraisonsChargees &&
        utilisateurChargeId === user.id
      ) {
        return;
      }

      if (user.role_id === 20) {
        setLivraisons([]);
        setLivraisonsError("");
        setLivraisonsLoading(false);
        setLivraisonsChargees(true);
        setUtilisateurChargeId(user.id);

        return;
      }

      try {
        setLivraisonsLoading(true);
        setLivraisonsError("");

        const res = await apiFetch(
          "/livraisonsJour",
          "GET",
        );

        const datas = await res.json();

        if (!res.ok) {
          throw new Error(
            datas.message ||
              datas.error ||
              "Impossible de récupérer les livraisons",
          );
        }

        const nouvellesLivraisons =
          Array.isArray(datas)
            ? datas
            : Array.isArray(datas.livraisons)
              ? datas.livraisons
              : [];

        setLivraisons(nouvellesLivraisons);
        setLivraisonsChargees(true);
        setUtilisateurChargeId(user.id);
      } catch (error) {
        console.error(
          "Erreur récupération livraisons :",
          error,
        );

        setLivraisonsError(
          error.message ||
            "Une erreur est survenue",
        );
      } finally {
        setLivraisonsLoading(false);
      }
    };

    recupererLivraisons();
  }, [
    user?.id,
    user?.role_id,
    livraisonsChargees,
    utilisateurChargeId,
    setLivraisons,
    setLivraisonsLoading,
    setLivraisonsError,
    setLivraisonsChargees,
    setUtilisateurChargeId,
  ]);

  const handleActif = (index) => {
    setLivActif(index);
  };

  return (
    <div className="mb-25 flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-scroll px-4">
      {livraisonsLoading && (
        <Pulse className="pt-10" />
      )}

      {!livraisonsLoading &&
        livraisonsError && (
          <p className="pt-10 text-center text-red-500">
            {livraisonsError}
          </p>
        )}

      {!livraisonsLoading &&
        !livraisonsError &&
        livraisons.length === 0 && (
          <p className="pt-10 text-center text-white/60">
            Aucune livraison disponible.
          </p>
        )}

      {livraisons.map((livraison, index) =>
        index === livActif ? (
          <CardLivraisons
            key={
              livraison.numeroDeLivraison ??
              index
            }
            onClick={() =>
              handleActif(index)
            }
            {...livraison}
          />
        ) : (
          <CardLivReduit
            key={
              livraison.numeroDeLivraison ??
              index
            }
            onClick={() =>
              handleActif(index)
            }
            {...livraison}
          />
        ),
      )}
    </div>
  );
}