import { createContext, useState } from "react";

export const ContactContext = createContext({
  listeContacts : [],
  setListeContacts:()=>{},
  conversationActive: null,
  setConversationActive: () => {},
  
})

export const ContactContextProvider = ({ children }) => {
  const [listeContacts, setListeContacts] = useState([]);
  const [conversationActive, setConversationActive] = useState(null);

  return ( <ContactContext.Provider value={{listeContacts, setListeContacts, conversationActive, setConversationActive}}>{children}</ContactContext.Provider>)
};
