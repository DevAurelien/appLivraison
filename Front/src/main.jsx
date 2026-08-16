import { createRoot } from "react-dom/client";
import { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { useLocation } from "react-router-dom";

import App from "./App.jsx";
import "./style.css";

import {
  MenuContext,
  MenuContextProvider,
} from "./contexte/menuContext.jsx";

import { PointageContextProvider } from "./contexte/pointageContext.jsx";
import { NavContextProvider } from "./contexte/navContext.jsx";
import { UserContextProvider } from "./contexte/userContext.jsx";
import { ContactContextProvider } from "./contexte/contactContext.jsx";
import { LivraisonsContextProvider } from "./contexte/livraisonsContext.jsx";

import BarreNavigation from "./Navigation.jsx";

function Layout() {
  const { pathname } = useLocation();

  const cacherNav =
    pathname === "/connection" ||
    pathname === "/inscription";

  return (
    <>
      <App />
      {!cacherNav && <BarreNavigation />}
    </>
  );
}

const container =
  document.getElementById("root");

if (!container) {
  throw new Error(
    "Conteneur #root introuvable",
  );
}

const root =
  container.__reactRoot ??
  createRoot(container);

container.__reactRoot = root;

root.render(
  <UserContextProvider>
    <NavContextProvider>
      <PointageContextProvider>
        <ContactContextProvider>
          <LivraisonsContextProvider>

            <BrowserRouter>
              <MenuContextProvider>
                <Layout />
              </MenuContextProvider>
            </BrowserRouter>

          </LivraisonsContextProvider>
        </ContactContextProvider>
      </PointageContextProvider>
    </NavContextProvider>
  </UserContextProvider>,
);