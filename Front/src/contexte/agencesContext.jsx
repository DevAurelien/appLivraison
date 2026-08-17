import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import apiFetch from "../utils/apiFetch";
import { UserContext } from "./userContext.jsx";

export const AgencesContext = createContext({
  listeAgences: [],
  setListeAgences: () => {},
  recupererAgences: () => {},
});

export const AgencesContextProvider = ({ children }) => {
  const [listeAgences, setListeAgences] = useState([]);

  const { user } = useContext(UserContext);

  const recupererAgences = useCallback(async () => {
    try {
      const res = await apiFetch(
        "/administration/agences/recuperation",
      );

      if (!res.ok) {
        setListeAgences([]);
        return;
      }

      const data = await res.json();

      setListeAgences(data);
    } catch (e) {
      console.error("Erreur récupération agences :", e);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    recupererAgences();
  }, [user?.id, recupererAgences]);

  return (
    <AgencesContext.Provider
      value={{
        listeAgences,
        setListeAgences,
        recupererAgences,
      }}
    >
      {children}
    </AgencesContext.Provider>
  );
};