import { createContext, useState } from "react";

export const UserContext = createContext({
  token:"",
  setToken: () => {},
});

export const UserContextProvider = ({ children }) => {

    const [token, setToken] = useState("")

  return ( <UserContext.Provider value={{token, setToken}}>{children}</UserContext.Provider>)
};
