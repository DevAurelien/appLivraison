import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MenuContextProvider } from "./contexte/menuContext.jsx";
import { NavContextProvider } from "./contexte/navContext.jsx";
import { UserContextProvider } from "./contexte/userContext.jsx";
import BarreNavigation from "./Navigation.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <MenuContextProvider>
        <NavContextProvider>
          <Routes>
      
            <Route path="/" element={<><App /><BarreNavigation /></>} />
          </Routes>
        </NavContextProvider>
      </MenuContextProvider>
    </UserContextProvider>
  </BrowserRouter>,
);
{
  /* <Route path="/seConnecter" element={<SeConnecter />} />
        <Route path="/inscription" element={<Inscription />} /> */
}
