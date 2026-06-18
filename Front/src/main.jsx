import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MenuContextProvider } from "./contexte/menuContext.jsx";



createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MenuContextProvider>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </MenuContextProvider>
  </BrowserRouter>,
);
   {/* <Route path="/seConnecter" element={<SeConnecter />} />
        <Route path="/inscription" element={<Inscription />} /> */}