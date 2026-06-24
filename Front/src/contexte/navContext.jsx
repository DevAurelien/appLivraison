import { createContext, useState } from "react";

export const NavContext = createContext({
  menuSelectionne: "Accueil",
  setMenuSelectionne: () => {},
});

export const NavContextProvider = ({ children }) => {

    const [menuSelectionne, setMenuSelectionne] = useState("Accueil")

  return ( <NavContext.Provider value={{menuSelectionne, setMenuSelectionne}}>{children}</NavContext.Provider>)
};
