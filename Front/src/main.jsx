import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MenuContext, MenuContextProvider } from "./contexte/menuContext.jsx";
import { NavContextProvider } from "./contexte/navContext.jsx";
import { UserContextProvider } from "./contexte/userContext.jsx";
import { ContactContextProvider } from "./contexte/contactContext.jsx";
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

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <MenuContextProvider>
        <NavContextProvider>
          <ContactContextProvider>
            <Routes>
              <Route path="/" element={<Layout />} />
            </Routes>
          </ContactContextProvider>
        </NavContextProvider>
      </MenuContextProvider>
    </UserContextProvider>
  </BrowserRouter>,
);
