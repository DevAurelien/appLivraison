import { createContext, useState } from "react";

export const LivraisonsContext = createContext({
  livraisons: [],
  setLivraisons: () => {},
  livraisonsLoading: false,
  setLivraisonsLoading: () => {},
  livraisonsError: "",
  setLivraisonsError: () => {},
  livraisonsChargees: false,
  setLivraisonsChargees: () => {},
  utilisateurChargeId: null,
  setUtilisateurChargeId: () => {},
});

export function LivraisonsContextProvider({ children }) {
  const [livraisons, setLivraisons] = useState([]);
  const [livraisonsLoading, setLivraisonsLoading] =
    useState(false);

  const [livraisonsError, setLivraisonsError] =
    useState("");

  const [livraisonsChargees, setLivraisonsChargees] =
    useState(false);

  const [utilisateurChargeId, setUtilisateurChargeId] =
    useState(null);

  return (
    <LivraisonsContext.Provider
      value={{
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
      }}
    >
      {children}
    </LivraisonsContext.Provider>
  );
}