import { createContext, useState } from "react";

export const UserContext = createContext({
  accessToken:"",
  setUser:()=>{},
  name:"",
  role:"",
  creeLe:"",
  email:""
})

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("accessToken");
      return stored ? JSON.parse(stored).accessToken : "";
    } catch {
      return "";
    }
  });

  return ( <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>)
};