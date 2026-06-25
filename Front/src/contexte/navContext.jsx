import { createContext, useState } from "react";

export const NavContext = createContext({
  menuSelectionne: "connection",
  setMenuSelectionne: () => {},
});

export const NavContextProvider = ({ children }) => {

    const [menuSelectionne, setMenuSelectionne] = useState("connection")

  return ( <NavContext.Provider value={{menuSelectionne, setMenuSelectionne}}>{children}</NavContext.Provider>)
};
