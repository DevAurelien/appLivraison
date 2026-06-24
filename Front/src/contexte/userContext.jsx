import { createContext, useState } from "react";

export const UserContext = createContext({
  token:"",
  setToken:()=>{}
})

export const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      const stored = localStorage.getItem("token");
      return stored ? JSON.parse(stored).accessToken : "";
    } catch {
      return "";
    }
  });

  return ( <UserContext.Provider value={{token, setToken}}>{children}</UserContext.Provider>)
};