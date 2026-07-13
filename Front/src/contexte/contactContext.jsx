import { createContext, useState } from "react";

export const ContactContext = createContext({
  listeContacts : [],
  setListeContacts:()=>{},
  
})

export const ContactContextProvider = ({ children }) => {
  const [listeContacts, setListeContacts] = useState([]);

  return ( <ContactContext.Provider value={{listeContacts, setListeContacts}}>{children}</ContactContext.Provider>)
};