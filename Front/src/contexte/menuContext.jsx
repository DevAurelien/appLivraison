import { createContext, useState } from "react";

export const MenuContext = createContext({
  page: "connection",
  setPage: () => {},
});

export function MenuContextProvider({ children }) {
  const [page, setPage] = useState("connection");

  return (
    <MenuContext.Provider value={{ page, setPage }}>
      {children}
    </MenuContext.Provider>
  );
}