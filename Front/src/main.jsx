import { createRoot } from "react-dom/client";
import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";

import App from "./App.jsx";
import "./style.css";

import { MenuContext, MenuContextProvider } from "./contexte/menuContext.jsx";

import { PointageContextProvider } from "./contexte/pointageContext.jsx";
import { NavContextProvider } from "./contexte/navContext.jsx";
import { UserContextProvider } from "./contexte/userContext.jsx";
import { ContactContextProvider } from "./contexte/contactContext.jsx";
import { LivraisonsContextProvider } from "./contexte/livraisonsContext.jsx";
import { AgencesContextProvider } from "./contexte/agencesContext.jsx";
import { SecteursContextProvider } from "./contexte/secteursContext.jsx";
import MiseAJourPWA from "./utils/MiseAJourPWA.jsx";
import InstallationPWA from "./utils/InstallationPWA.jsx";

import BarreNavigation from "./Navigation.jsx";

function Layout() {
  const { pathname } = useLocation();

  const cacherNav = pathname === "/connection" || pathname === "/inscription";

  return (
    <>
      <App />
      {!cacherNav && <BarreNavigation />}
      <MiseAJourPWA />
      <InstallationPWA />
    </>
  );
}

const container = document.getElementById("root");

if (!container) {
  throw new Error("Conteneur #root introuvable");
}

const root = container.__reactRoot ?? createRoot(container);

container.__reactRoot = root;

root.render(
  <UserContextProvider>
    <NavContextProvider>
      <PointageContextProvider>
        <ContactContextProvider>
          <AgencesContextProvider>
            <SecteursContextProvider>
              <LivraisonsContextProvider>
                <BrowserRouter>
                  <MenuContextProvider>
                    <Layout />
                  </MenuContextProvider>
                </BrowserRouter>
              </LivraisonsContextProvider>
            </SecteursContextProvider>
          </AgencesContextProvider>
        </ContactContextProvider>
      </PointageContextProvider>
    </NavContextProvider>
  </UserContextProvider>,
);
