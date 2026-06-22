import { createContext, useState } from "react";

export const NavContext = createContext({
  menuSelectionne: "accueil",
  setMenuSelectionne: () => {},
});

export const NavContextProvider = ({ children }) => {

    const [menuSelectionne, setMenuSelectionne] = useState("accueil")

  return ( <NavContext.Provider value={{menuSelectionne, setMenuSelectionne}}>{children}</NavContext.Provider>)
};
