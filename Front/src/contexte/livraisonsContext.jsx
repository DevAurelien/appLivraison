import { createContext, useState, useEffect } from "react";
import apiFetch from "../utils/apiFetch";

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

  useEffect(()=>{
    const  requete = async ()=> {
      try {
        const res = await apiFetch("/livraisonsAll", "GET")
        if(!res.ok) return;
        const data = await res.json();
        setLivraisons(data);
      }catch(e){
        console.log(e)
      }
    }
    requete()
  },[])

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