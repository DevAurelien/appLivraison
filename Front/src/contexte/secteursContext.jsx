import { createContext, useCallback, useMemo, useState } from "react";

import apiFetch from "../utils/apiFetch";

// Le contexte et son provider sont gardes ensemble, comme les autres contextes du projet.
// eslint-disable-next-line react-refresh/only-export-components
export const SecteursContext = createContext({
  listeSecteurs: [],
  chargementSecteurs: false,
  erreurSecteurs: null,
  recupererSecteurs: async () => [],
  modifierSecteur: async () => null,
  supprimerSecteur: async () => null,
  viderSecteurs: () => {},
});

export function SecteursContextProvider({ children }) {
  const [listeSecteurs, setListeSecteurs] = useState([]);
  const [chargementSecteurs, setChargementSecteurs] = useState(false);
  const [erreurSecteurs, setErreurSecteurs] = useState(null);

  const viderSecteurs = useCallback(() => {
    setListeSecteurs([]);
    setErreurSecteurs(null);
  }, []);

  const recupererSecteurs = useCallback(async (agenceId) => {
    if (!agenceId) {
      viderSecteurs();
      return [];
    }

    setChargementSecteurs(true);
    setErreurSecteurs(null);
    setListeSecteurs([]);

    try {
      const res = await apiFetch(
        `/administration/secteurs/recuperation?agence_id=${encodeURIComponent(agenceId)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de recuperer les secteurs");
      }

      const secteursRecuperes = Array.isArray(data.donnees)
        ? data.donnees
        : [];

      setListeSecteurs(secteursRecuperes);
      return secteursRecuperes;
    } catch (e) {
      setListeSecteurs([]);
      setErreurSecteurs(e.message);
      console.error("Erreur recuperation secteurs :", e);
      return [];
    } finally {
      setChargementSecteurs(false);
    }
  }, [viderSecteurs]);

  const modifierSecteur = useCallback(async (id, secteur) => {
    setErreurSecteurs(null);

    try {
      const res = await apiFetch(
        `/administration/secteurs/modification/${encodeURIComponent(id)}`,
        "PATCH",
        { body: JSON.stringify(secteur) },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de modifier le secteur");
      }

      setListeSecteurs((secteursActuels) =>
        secteursActuels.map((secteurActuel) =>
          secteurActuel.id === data.donnees.id ? data.donnees : secteurActuel,
        ),
      );

      return data.donnees;
    } catch (e) {
      setErreurSecteurs(e.message);
      throw e;
    }
  }, []);

  const supprimerSecteur = useCallback(async (id) => {
    setErreurSecteurs(null);

    try {
      const res = await apiFetch(
        `/administration/secteurs/suppression/${encodeURIComponent(id)}`,
        "DELETE",
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de supprimer le secteur");
      }

      setListeSecteurs((secteursActuels) =>
        secteursActuels.filter((secteur) => secteur.id !== data.donnees.id),
      );

      return data.donnees;
    } catch (e) {
      setErreurSecteurs(e.message);
      throw e;
    }
  }, []);

  const valeur = useMemo(() => ({
    listeSecteurs,
    chargementSecteurs,
    erreurSecteurs,
    recupererSecteurs,
    modifierSecteur,
    supprimerSecteur,
    viderSecteurs,
  }), [
    listeSecteurs,
    chargementSecteurs,
    erreurSecteurs,
    recupererSecteurs,
    modifierSecteur,
    supprimerSecteur,
    viderSecteurs,
  ]);

  return (
    <SecteursContext.Provider value={valeur}>
      {children}
    </SecteursContext.Provider>
  );
}
