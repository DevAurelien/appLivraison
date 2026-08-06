import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MenuContext, MenuContextProvider } from "./contexte/menuContext.jsx";
import { PointageContextProvider } from "./contexte/pointageContext.jsx";
import { NavContextProvider } from "./contexte/navContext.jsx";
import { UserContextProvider } from "./contexte/userContext.jsx";
import { ContactContextProvider } from "./contexte/contactContext.jsx";
import { LivraisonsContextProvider } from "./contexte/livraisonsContext.jsx";
import BarreNavigation from "./Navigation.jsx";
import { useContext } from "react";

function Layout() {
  const { page } = useContext(MenuContext);
  const cacherNav = page === "connection" || page === "inscription";

  return (
    <>
      <App />
      {!cacherNav && <BarreNavigation />}
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
  <BrowserRouter>
    <UserContextProvider>
      <MenuContextProvider>
        <NavContextProvider>
          <PointageContextProvider>
            <ContactContextProvider>
              <LivraisonsContextProvider>
                <Routes>
                  <Route path="/" element={<Layout />} />
                </Routes>
              </LivraisonsContextProvider>
            </ContactContextProvider>
          </PointageContextProvider>
        </NavContextProvider>
      </MenuContextProvider>
    </UserContextProvider>
  </BrowserRouter>,
);
