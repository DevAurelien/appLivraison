import { createContext, useState } from "react";

export const PointageContext = createContext({
  pointage: {},
  setPointage: () => {},
});

export const PointageContextProvider = ({ children }) => {
    const [pointage, setPointage] = useState({})
  return (
    <PointageContext.Provider value={{ pointage, setPointage }}>
      {children}
    </PointageContext.Provider>
  );
};
